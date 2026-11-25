# Noters

A notes app built with the MERN stack. Sign up, then create, search, edit and delete your own notes. Light and dark interface that follows your system setting.

**Live demo:** https://noters-aj0u.onrender.com/ (use the "Try the demo account" button on the login page)

> **Portfolio project.** I built it to practice full-stack work: auth, validation, tests, CI and deployment. Do not store anything private in the demo account, because everyone who tries it shares the same notes.

## Features

- Accounts with hashed passwords and an httpOnly cookie session
- Notes are private per user (enforced in every database query, covered by tests)
- Search, pagination, input validation and one consistent error format
- Rate limiting per client IP, with a stricter limit on login and register
- Dark and light themes

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, React Router, Tailwind CSS 4, daisyUI 5
- **Backend:** Node.js, Express 4, TypeScript, Mongoose, Zod
- **Database:** MongoDB
- **Rate limiting:** Upstash Redis
- **Tests:** Vitest, Supertest and an in-memory MongoDB (API), Testing Library (components)
- **CI:** GitHub Actions
- **Hosting:** Render (one web service serves the API and the built frontend)

## Architecture

```
Browser (React)  --cookie-->  Express API  -->  MongoDB
                                  |
                                  +-->  Upstash Redis (rate limits)
```

```
backend/
  src/
    app.ts          builds the Express app (used by server.ts and the tests)
    server.ts       loads env, connects to MongoDB, listens
    routes/         auth and notes routes
    controllers/    request handlers and Zod schemas
    middleware/     requireAuth (reads the cookie), rateLimiter
    models/         User, Note
    lib/errors.ts   HttpError, async wrapper, the one error handler
  test/             API tests
  scripts/          seed-demo.ts
frontend/
  src/
    pages/          Home, Create, NoteDetail, Auth (login and register)
    components/     Navbar, NoteCard, ProtectedRoute, ...
    context/        AuthContext (current user, login, logout)
  test/             component tests
```

How a request works: the browser sends the session cookie, `requireAuth` verifies the JWT and sets `req.userId`, and every note query filters on that id. A note that belongs to someone else returns 404, the same as one that does not exist.

## Getting started

You need Node.js 20+, a [MongoDB](https://www.mongodb.com/atlas) connection string and an [Upstash Redis](https://upstash.com) database.

### Backend

Create `backend/.env`:

```
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<a long random string>
PORT=5001
UPSTASH_REDIS_REST_URL=<your_upstash_rest_url>
UPSTASH_REDIS_REST_TOKEN=<your_upstash_rest_token>
```

Generate a secret with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The frontend talks to the API at http://localhost:5001.

### Demo account

```bash
npm run seed --prefix backend
```

Creates `demo@noters.app` with a few sample notes. Run it again to reset them.

## Tests

```bash
npm test                    # backend and frontend
npm test --prefix backend   # API only (downloads an in-memory MongoDB on first run)
```

CI runs typecheck, lint, tests and the build on every push and pull request.

## API

All `/api/notes` routes need a logged-in session. Errors always look like `{ "message": "...", "errors": [{ "field": "...", "message": "..." }] }` (`errors` only for validation failures).

| Method | Route                | Description                                           |
| ------ | -------------------- | ----------------------------------------------------- |
| POST   | `/api/auth/register` | Create an account and log in                          |
| POST   | `/api/auth/login`    | Log in                                                |
| POST   | `/api/auth/logout`   | Log out                                               |
| GET    | `/api/auth/me`       | Current user                                          |
| GET    | `/api/notes`         | Your notes. Query: `search`, `page`, `limit` (max 50) |
| GET    | `/api/notes/:id`     | One note                                              |
| POST   | `/api/notes`         | Create a note                                         |
| PUT    | `/api/notes/:id`     | Update a note                                         |
| DELETE | `/api/notes/:id`     | Delete a note                                         |

## Deploying on Render

- **Build command:** `npm run build`
- **Start command:** `npm start`
- **Environment:** `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Do not set `PORT`.
- MongoDB Atlas must allow connections from Render (Network Access).
- After the first deploy, run `npm run seed --prefix backend` once with the production `MONGODB_URI` to create the demo account.

## Decisions

- **MongoDB stays.** Notes are simple documents and the app does not need joins. PostgreSQL would be the choice if the data became relational.
- **Cookie session, not localStorage.** An httpOnly cookie cannot be read by page scripts, which limits the damage of an XSS bug.
- **Backend runs through `tsx`.** There is no separate compile step to deploy. A compiled build would start faster.

## Known limits

- The free Render plan sleeps after about 15 minutes idle, so the first load can take up to a minute. The app shows a message while it wakes.
- Search is a case-insensitive scan of the user's own notes. For thousands of notes per user it should become a MongoDB text index.
- No email verification, password reset or "log out everywhere". Sessions last 7 days.
- Notes created before accounts existed have no owner and are not shown to anyone.
- The demo account is shared, so its notes can be changed by any visitor.

## License

MIT
