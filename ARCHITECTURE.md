# Architecture

Why this is built the way it is. For how authorisation and money are handled,
see [SECURITY.md](SECURITY.md).

---

## Shape

```
Browser ──► Next.js (:3000) ──► NestJS API (:3001) ──► PostgreSQL + PostGIS
```

Two applications, one database. The web app is a client of the API and holds no
database credentials. Every business rule — pricing, availability,
authorisation — lives in the API, because the browser is not a place you can
enforce anything.

The web app talks to the API through one module, `lib/api-client.ts`. It owns
the base URL, attaches the bearer token, and unpacks the API's error shape.
Nothing else in the app calls `fetch`. When a `401` comes back it clears the
stored token, so a stale session signs the user out instead of every subsequent
call retrying with a token the server has already rejected.

---

## The API

### One database configuration

`src/config/data-source.ts` is the only place the connection is defined, and
both the Nest runtime and the TypeORM CLI read it. Migrations therefore run
against exactly the schema the app connects to.

There used to be three: two files that nothing imported and disagreed with each
other about whether the connection came from `DATABASE_URL` or from
`DATABASE_HOST`, plus the one actually in use, inlined in `app.module.ts`.

### Migrations own the schema

`synchronize` is **off everywhere, including development**.

It was previously `NODE_ENV !== 'production'`, meaning TypeORM built the schema
from the entities locally while production ran the migrations. Two sources of
truth for one schema, free to drift.

They did drift, and the damage is a good illustration. `vehicles.location` was
declared:

```ts
@Column('geometry', { type: 'point', srid: 4326 })
```

The options object's `type` overrides the first argument, so TypeORM read the
column as Postgres's native `point` rather than a PostGIS geometry — and with
synchronize on, it silently altered the column the migration had created. Every
spatial query broke, and nothing in development showed it, because development
was running on the altered schema.

CI applies the migrations to a real PostGIS database, reverts them, and applies
them again. A migration without a working `down()` is one you cannot deploy
safely.

### Module layout

Feature-per-module, the standard Nest arrangement: `auth`, `vehicles`,
`bookings`, `payments`, `notifications`, `reviews`, `users`. Entities and
migrations sit together under `database/`, since the schema is one thing rather
than a per-module concern.

`common/types/authenticated-request.ts` types what the JWT strategy attaches to
the request. Controllers used `@Req() req: any`, which switched off checking for
every property read off it — including `req.user.userId`, the value every
authorisation decision is made from.

---

## Decisions worth explaining

### PostGIS rather than latitude and longitude columns

Vehicles carry a `geometry(Point, 4326)`. Searching within a radius is:

```sql
ST_DWithin(
  vehicle.location::geography,
  ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
  :radius * 1000
)
```

Casting to `geography` makes `ST_DWithin` measure metres on the spheroid rather
than degrees, which is what a person means by "within 20 km". Two float columns
and the Haversine formula in application code would work for small distances,
but it cannot use a spatial index and gets the maths wrong near the poles and
the antimeridian.

The cost is real and worth naming: **the database must be PostGIS.** A stock
`postgres` image fails on the first migration. That is why `docker-compose.yml`
and CI both pin `postgis/postgis:16-3.4`.

Writes go in as GeoJSON through TypeORM rather than as interpolated
`ST_MakePoint` strings, so coordinates are never concatenated into SQL.

### A row lock rather than a unique constraint

Two people booking the same car for overlapping dates is a race. The overlap
check and the insert were two statements with nothing between them, so both
requests could pass the check.

Booking creation now opens a transaction, takes a `pessimistic_write` lock on
the **vehicle** row, then checks and inserts. Requests for the same vehicle
queue behind each other; requests for different vehicles do not block at all.

A Postgres exclusion constraint over a `tstzrange` would push the rule into the
database, which is stronger. It was not used here because the booking dates are
`date` columns and the range would have to be maintained alongside them,
splitting the rule across two representations. The lock keeps one.

The overlap predicate is the standard form — two ranges overlap when each starts
before the other ends:

```sql
booking.start_date <= :endDate AND booking.end_date >= :startDate
```

It replaced three `BETWEEN` clauses that were harder to check at the boundaries.

### Notifications inside the caller's transaction

`NotificationsService.create` takes an optional `EntityManager`. When a booking
writes its notification, it passes the transaction's manager, so a booking that
rolls back cannot leave behind a notice saying it worked.

A queue would decouple this properly. At this size the transaction is the
simpler correct answer, and it is the one that fails safe.

### The client never sees an internal shape

The API speaks `snake_case` and calls them vehicles. The UI speaks `camelCase`
and calls them cars. Each `lib/*.ts` module maps between the two in one
function, so a change to a column name lands in one place.

Postgres returns `decimal` columns as strings to avoid losing precision in
JavaScript numbers. Every price and rating is parsed at that boundary rather
than wherever it happens to be rendered.

### Availability is a boolean

The UI used to show vehicles as available, rented, or in maintenance. The
database has `available: boolean`. Rather than invent the missing states in the
frontend, the UI shows the two that exist. A maintenance state, if it is wanted,
belongs in the schema first.

---

## Testing

41 unit tests on the API, covering the parts where being wrong costs money or
leaks data: pricing from the server rather than the request, the row lock and
overlap rejection, payment authorisation, notification scoping, and the login
timing behaviour.

They mock the repositories. That keeps them fast and keeps CI simple, and it
means they check the service's decisions, not TypeORM. The integration proof
comes from CI running the migrations and the seed against a real PostGIS
database — the layer the unit tests deliberately do not touch.

---

## What is deliberately absent

- **No card processing.** No Stripe, no PayPal. Payments are recorded and an
  administrator confirms receipt. A gateway means webhooks, idempotency keys and
  reconciliation, and a half-built one is worse than none.
- **No password reset.** It needs email delivery, which is not configured.
- **No refresh tokens.** A day-long token that cannot be revoked early is a
  known limitation, listed in SECURITY.md rather than papered over.
