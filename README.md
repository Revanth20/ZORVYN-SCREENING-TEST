
# Finance Dashboard Backend

A backend for a finance dashboard that handles user role management, financial records, aggregated analytics, and role-based access control.

---

## Live

| Version      | URL                                                                                                         |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| With auth    | [zorvyn-screening-test-with-auth.onrender.com/docs](https://zorvyn-screening-test-with-auth.onrender.com/docs) |
| Without auth | [zorvyn-screening-test.onrender.com/docs](https://zorvyn-screening-test.onrender.com/docs)                     |

The `without-auth` branch is a version where the role is passed directly via a request header — no login flow. The master branch (this one) has full JWT-based authentication.

---

## Tech Stack

| Layer         | Choice               | Reason                                                                       |
| ------------- | -------------------- | ---------------------------------------------------------------------------- |
| Runtime       | Node.js + TypeScript | Type safety across the entire codebase                                       |
| Framework     | Fastify              | Faster than Express, built-in schema validation and Swagger support          |
| ORM           | Drizzle ORM          | Lightweight, type-safe, close to raw SQL without losing TypeScript inference |
| Database      | PostgreSQL           | Relational structure suits financial data with clear relationships           |
| Validation    | Zod                  | Runtime + compile-time validation from a single schema definition            |
| Documentation | @fastify/swagger     | Auto-generated OpenAPI docs from route schemas                               |
| Rate Limiting | @fastify/rate-limit  | Built-in Fastify plugin, minimal configuration                               |

### Why these choices specifically

**TypeScript** — I already knew JavaScript well enough to get things done, but for something that's supposed to feel production-ready, plain JS felt risky. With TypeScript, I can define the shape of my data once and the editor just tells me where things will break before I even run the code. Especially for something like financial records where the wrong type in the wrong place can silently cause wrong calculations — having that safety net while writing made the whole thing move faster, not slower.

**Fastify over Express** — I've built APIs with Express before so it's familiar territory, but I wanted to try Fastify for this. The main thing is it's noticeably faster than Express because of how it handles serialization internally. It also has built-in JSON schema validation on routes, which pairs well with the Swagger setup — you define the schema once and both validation and docs come from it. In Express I would have had to wire those up separately.

**Zod over plain TypeScript interfaces** — TypeScript interfaces are great for compile-time type checking, but they completely disappear at runtime. If someone sends the wrong shape in a request body, TypeScript won't catch it — it's already compiled away. Zod validates the actual data at runtime and also gives you the TypeScript types through `z.infer<>`, so you're not maintaining two separate things. One schema does both jobs.

**Drizzle ORM** — I looked at Prisma first since it's more popular, but Drizzle felt more honest about what it's doing. The queries look and feel close to actual SQL, which made writing the dashboard aggregations — things like `FILTER (WHERE ...)` on grouped sums — straightforward without fighting the abstraction. It's also lightweight and fully TypeScript-native without a code generation step.

**PostgreSQL over MySQL** — I've used MySQL before and it works fine, but PostgreSQL has better support for some SQL features I needed here — specifically the `FILTER (WHERE ...)` clause on aggregate functions and `DATE_TRUNC` for the trend queries. These let me compute income and expense totals in a single query instead of two, and group records by day/week/month/year cleanly. MySQL can do similar things but the syntax is less clean for these patterns.

**Nodemon** — standard dev tool, just restarts the server automatically on file changes. Nothing special, just saves the manual restart every time.

**Swagger** — I used to document APIs by just exporting a Postman collection. This project was actually the first time I used Swagger properly. The way it generates the docs automatically from the route schemas is genuinely useful — there's no separate documentation file to keep in sync with the code. Whatever the schema says, the docs reflect it immediately.

**Rate limiting** — In Express there's `express-rate-limit` as a separate package anyway, so it's not that different here. `@fastify/rate-limit` is the official Fastify plugin and it integrates cleanly. I applied a global limit and then tighter limits per route group since the dashboard and write operations are heavier than a simple read.

---

## Project Structure

```
src/
  controllers/        # Request handlers — parse input, call queries, send response
  drizzle/            # DB connection, schema definitions, query functions
  middlewares/        # authorize middleware for role-based access control
  routes/             # Route registration with schema and preHandler
  utilities/          # Zod schemas + inferred types, JWT utility
  server.ts           # App entry point — registers plugins and routes
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

### 3. Run database migrations

```bash
npx drizzle-kit push
```

### 4. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

### 5. View API documentation

Once the server is running, open:

```
http://localhost:3000/docs
```

---

## API Overview

### Auth — `/auth`

| Method | Endpoint         | Description                                                  |
| ------ | ---------------- | ------------------------------------------------------------ |
| POST   | `/auth/signup` | Register a new user with username, password, and role        |
| POST   | `/auth/login`  | Login and receive a JWT in the Authorization response header |

### Users — `/users`

> All user routes require `role: admin`

| Method | Endpoint       | Description                                                    |
| ------ | -------------- | -------------------------------------------------------------- |
| POST   | `/users`     | Create a new user                                              |
| PUT    | `/users/:id` | Update a user                                                  |
| DELETE | `/users/:id` | Soft delete a user                                             |
| GET    | `/users/:id` | Get a user by ID                                               |
| GET    | `/users`     | Get all users with search, role, status filters and pagination |

### Records — `/records`

> Write operations require `role: admin`. Read operations allow `admin`, `analyst`, `viewer`

| Method | Endpoint         | Description                                             |
| ------ | ---------------- | ------------------------------------------------------- |
| POST   | `/records`     | Create a financial record                               |
| PUT    | `/records/:id` | Update a record                                         |
| DELETE | `/records/:id` | Soft delete a record                                    |
| GET    | `/records/:id` | Get a record by ID                                      |
| GET    | `/records`     | Get all records with search, type filter and pagination |

### Dashboard — `/dashboard`

> All dashboard routes require `role: admin` or `role: analyst`

| Method | Endpoint                       | Description                               |
| ------ | ------------------------------ | ----------------------------------------- |
| GET    | `/dashboard/summary`         | Total income, total expense, net balance  |
| GET    | `/dashboard/categories`      | Income and expense breakdown per category |
| GET    | `/dashboard/recent`          | Recent records with pagination            |
| GET    | `/dashboard/trends?trend=1w` | Income/expense trends grouped by period   |

#### Trend format

The `trend` query param accepts `<number><unit>` format:

- `d` → days (e.g. `7d` = last 7 days, grouped by day)
- `w` → weeks (e.g. `2w` = last 2 weeks, grouped by week)
- `m` → months (e.g. `3m` = last 3 months, grouped by month)
- `y` → years (e.g. `1y` = last 1 year, grouped by year)

---

## Authentication & Access Control

Signup creates a user with a hashed password (bcrypt) stored separately from the user record. Login verifies the credentials and returns a JWT in the `Authorization` response header. Every protected route then reads that token from the `Authorization: Bearer <token>` request header, verifies it, and checks the role embedded in the payload.

```text
admin     → full access (users, records, dashboard)
analyst   → read records + full dashboard access
viewer    → read records only
```

The `authorize` middleware returns `401` if the token is missing, invalid, or expired, and `403` if the role doesn't have permission for that route.

I've done this kind of auth flow before in other projects — JWT verification, OTP, Google OAuth, Apple Sign In — so the pieces were familiar. The JWT utilities (`generateToken`, `verifyToken`) in `src/utilities/jwt.ts` are what tie everything together here.

---

## Design Decisions

**Single schema, no drift** — Zod schemas live in one file and serve as both the runtime validators and the TypeScript types via `z.infer<>`. I started with separate `types.ts` and validation logic but they kept drifting apart, so I merged them. Now changing a field means changing it in one place.

**Soft delete everywhere** — Nothing gets hard deleted. A `deletedAt` timestamp gets set instead, and every query filters with `isNull(deletedAt)`. Financial data especially shouldn't just disappear — soft delete keeps it recoverable.

**Drizzle stays close to SQL** — The dashboard aggregations use PostgreSQL's `FILTER (WHERE ...)` clause on `SUM` to get income and expense totals in a single query. Drizzle let me write that naturally without working around an ORM abstraction that doesn't understand it.

**The numeric string problem** — PostgreSQL's `numeric` type comes back as a string from Drizzle to avoid JS float precision loss. Every amount gets `Number()` on the way out and `.toString()` on the way in. It's a small annoyance but an explicit one — the alternative is silently losing precision.

**Rate limits at the plugin level** — Rather than adding rate limit config to every individual route, limits are set once at `app.register()` time per prefix group. `/users`, `/records`, and `/dashboard` each get 10 req/min since they're either admin-only or hitting aggregate queries. The global fallback is 100 req/min.

---

## Challenges & Learnings

**Swagger and the Authorization header** — I honestly didn't know about `securitySchemes` before this. When I added JWT I just put `authorization` as a header parameter in the route schema like I did for everything else. Swagger UI showed the field, I filled in the token, sent the request — got 401. I checked the network tab and the header just wasn't there at all even though I had typed the token in. Took me a bit to figure out that Swagger UI doesn't actually send the `Authorization` header when it's defined as a plain parameter — it silently drops it.

After digging into it I found out the right way is to define a `securityScheme` in the OpenAPI config (`type: http, scheme: bearer`) and use `security: [{ bearerAuth: [] }]` on each route. That gives you the **Authorize** button at the top of the docs — you enter the token once there and Swagger handles attaching it to every request. Didn't know that's how it worked before this project.

---

## Assumptions

- `date` on a financial record defaults to the current timestamp if not provided.
- Soft-deleted records are completely excluded — they won't show up in reads, filters, or dashboard aggregations, and they can't be updated either.
- The `trend` parameter groups by its own unit — so `2w` gives back exactly 2 data points, one per week. It doesn't paginate across a larger range.
- Amount precision loss at the JS layer is acceptable — amounts are stored as PostgreSQL `numeric` for accuracy in the DB, but coerced to JS `number` at the API response level.
