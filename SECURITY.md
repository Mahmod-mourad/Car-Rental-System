# Security

How authentication, authorisation and money are handled here, and why.

Everything below is enforced by the API. The web app hides buttons a user
cannot use, but that is presentation — none of it is a control.

---

## Authentication

Passwords are hashed with **bcrypt at cost 12**. The plaintext is never stored
or logged. `password_hash` is `select: false` on the entity, so it is only
loaded by the query that needs to compare it.

Sign-in is JWT. The token carries the user's id, email and role, and is signed
with `JWT_SECRET`. **The API refuses to start in production if `JWT_SECRET` is
missing or still the value from `.env.example`.**

Two details in the login path that are easy to get wrong:

**One message for both failures.** An unknown email and a wrong password return
the same `401` with the same text. Distinguishing them tells an attacker which
addresses have accounts.

**Constant work either way.** When the email does not exist, the service still
runs a bcrypt comparison against a dummy hash before failing. Returning early
would make a missing account measurably faster than a wrong password, and the
difference is enough to enumerate registered emails by timing alone.

Emails are trimmed and lowercased on both registration and login, so one
address cannot become two accounts.

### What this replaced

Authentication used to be an `if` statement:

```ts
if (email === 'admin@example.com' && password === 'admin123') {
  // ... signs a real JWT with role: 'admin'
}
```

Anyone who cloned the repository and started it got an admin token by typing
`admin123`, and the error message named the accounts. The token also carried
`sub: 'mock-user-id'`, which is not a UUID, so every query joining on it failed.

The demo accounts the seed creates now are ordinary rows with real bcrypt
hashes. The API has no special case for them.

---

## Authorisation

The JWT guard is registered globally, so **every route is protected unless it
is explicitly opened** with `@Public()`. Opening a route is a deliberate act
you can grep for. The public ones are registration, login, and reading the
vehicle catalogue — a rental site has to be browsable before you sign up.

Roles come from the token and are checked by `RolesGuard`. Registration always
creates a `customer`; the field does not exist on `RegisterDto`, so nobody can
sign themselves up as an administrator.

### Reading other people's data

Every per-user resource is scoped by the id in the token, never by an id in the
request:

- `GET /bookings/my-bookings` takes filters, but the user id comes from the
  token. There is no parameter to swap.
- Notifications are read, updated and deleted by `(id, user_id)` together.
  Looking up by id alone would let anyone mark or delete someone else's
  notification by guessing a UUID.
- Creating a vehicle records the authenticated user as the owner.
  `CreateVehicleDto` used to take `owner_id`, which the service then ignored —
  mandatory and meaningless at the same time.

---

## Money

Three separate paths used to let someone rent a car for nothing. All three are
closed, and each has a test.

**The booking price is never accepted from the client.** `CreateBookingDto` took
`total_price` guarded only by `@Min(0)`, and the service wrote it straight onto
the booking, so `total_price: 0` was a free rental. The field is gone. The total
is `price_per_day × days`, read from the vehicle row.

**The payment amount is never accepted either.** `CreatePaymentDto` took
`amount`, and the booking was marked paid once that number reached the total.
The server now charges the outstanding balance — the booking total minus the
payments that have actually completed.

**Customers cannot settle their own payments.** `PATCH /payments/:id` allowed
the booking's owner through, and setting the status to `completed` marked the
booking paid. Moving a payment's status is admin-only now. A booking's payment
status is recomputed from its completed payments rather than from whichever
payment was last touched, so a refund reopens the balance instead of leaving
the booking marked paid forever.

---

## Availability

Double-booking was possible. The overlap check and the insert were separate
statements, so two requests arriving together both passed the check and both
wrote a booking.

Booking creation now runs in a transaction that takes a `pessimistic_write`
lock on the vehicle row before checking anything, which serialises requests per
vehicle. Conflicts answer `409`.

---

## Input handling

A global `ValidationPipe` runs with `whitelist` and `forbidNonWhitelisted`, so
unknown properties are rejected rather than ignored — a request carrying a field
the API dropped gets a `400` instead of appearing to work.

All queries go through TypeORM parameter binding. The one place a value reaches
SQL by name is the vehicle sort column, and it is matched against a fixed map of
four columns before it gets there; anything else falls back to the default.

CORS reads its allowed origins from `CORS_ORIGINS`. It was `origin: '*'` with
`credentials: true`, a combination browsers reject outright.

---

## Known gaps

Stated rather than hidden.

- **No rate limiting** on login. A real deployment needs it.
- **Tokens live in `localStorage`**, which is readable by any script that gets
  onto the page. httpOnly cookies would be better; that needs CSRF handling to
  go with them.
- **No refresh tokens.** A token is valid for a day and cannot be revoked before
  it expires.
- **No card processing.** Payments are recorded and confirmed by an
  administrator. There is no gateway integration and no pretence of one.
- **No password reset**, because there is no email delivery configured.
