# Car Rental System

A car rental platform: a NestJS API over PostgreSQL/PostGIS, and a Next.js web
app in Arabic. Customers browse a fleet, search by location, book dates, and
pay; staff manage vehicles, bookings and payments from an admin dashboard.

- **API** — NestJS 11, TypeORM, PostgreSQL 16 with PostGIS, JWT auth, Swagger
- **Web** — Next.js 15, React 19, TypeScript, Tailwind, Radix UI, RTL Arabic

---

## Running it

You need Docker. One command:

```bash
docker compose up --build
```

That starts PostGIS, runs the migrations, seeds the database, and brings up
both apps:

| | |
|---|---|
| Web app | http://localhost:3000 |
| API | http://localhost:3001 |
| Swagger | http://localhost:3001/api |

### Demo accounts

Created by the seed. Local development only.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@carrental.local` | `Password123!` |
| Agent | `agent@carrental.local` | `Password123!` |
| Customer | `customer@carrental.local` | `Password123!` |

These are ordinary rows with real bcrypt hashes. The API has no special case
for them.

### Without Docker

```bash
make install          # dependencies for both apps
make env              # .env files from the examples
                      # start PostGIS yourself on 5432, then:
make migrate          # build the schema
make seed             # load demo data
make dev-backend      # API on :3001
make dev-frontend     # web app on :3000
```

`make help` lists everything.

The database has to be **PostGIS**, not plain PostgreSQL. The first migration
creates the extension and `vehicles.location` is a geometry column.

---

## What it does

**Browsing and search.** Filter by make, model, type, year, price, rating,
transmission, fuel, and seat count, or search across make and model. Sort by
price, rating, year or name. Radius search runs on PostGIS `ST_DWithin` against
each vehicle's stored point, so "cars within 20 km of the airport" is a real
query, not a bounding box.

**Booking.** Pick dates, a pickup and return branch, and give a licence number.
The API prices the rental from the vehicle's stored daily rate — the price is
never accepted from the browser. Overlapping dates are refused, and the check
runs inside a transaction holding a row lock on the vehicle, so two people
booking the same car at the same moment cannot both succeed.

**Payment.** A payment is opened against a booking for whatever is still owed.
It starts pending. No card processor is wired up, so an administrator confirms
receipt; only then does the booking count as paid, and the status is recomputed
from the payments that actually completed, so a refund reopens the balance.

**Notifications.** Booking events write a notification in the same transaction
as the booking itself, so a rolled-back booking cannot leave a notice behind
saying it worked.

**Admin.** Vehicles CRUD, booking status changes, and a dashboard over users,
bookings, payments and revenue. Revenue counts completed payments only.

---

## Layout

```
Car-Rental-System-backend/
  src/
    auth/            registration, login, JWT strategy, guards
    vehicles/        catalogue, filters, PostGIS radius search
    bookings/        availability, pricing, overlap checks
    payments/        payment records and their state
    notifications/   per-user notifications
    reviews/         vehicle reviews
    users/           account administration
    database/
      entities/      TypeORM entities
      migrations/    the schema — every change lives here
      seeds/         demo data
    config/
      data-source.ts one config shared by the app and the TypeORM CLI

Car-Rental-System-Frontend/
  app/               routes (App Router)
  components/        UI
  contexts/          auth context
  lib/
    api-client.ts    base URL, bearer token, error shape — one place
    cars.ts          } each maps the API's snake_case
    bookings.ts      } to the camelCase the UI uses,
    payments.ts      } and nothing else talks to fetch
    notifications.ts }
    admin.ts
```

---

## Development

```bash
make test      # both test suites
make lint      # both apps
make build     # production build of both
```

The API has 41 unit tests over pricing, availability, authorisation and the
notification transaction. CI runs those, then applies the migrations to a real
PostGIS database, reverts them, and applies them again — a migration that
cannot be rolled back is one you cannot deploy safely.

The web app is type-checked and linted in CI. `next.config.mjs` does **not**
ignore build errors.

### Migrations

The schema is owned by the migrations. `synchronize` is off everywhere,
including development, so the local schema and production's cannot drift apart.

```bash
npm run migration:run      # apply
npm run migration:revert   # roll back the last one
npm run migration:show     # what is applied
```

---

## Notes

Two things this project deliberately does not do:

**No card processing.** There is no Stripe or PayPal integration and no
pretence of one. Payments are recorded and confirmed by an administrator.

**No password reset.** It needs email delivery, which is not set up here.

See [SECURITY.md](SECURITY.md) for how authentication, authorisation and
pricing are handled, and [ARCHITECTURE.md](ARCHITECTURE.md) for the design
decisions behind them.
