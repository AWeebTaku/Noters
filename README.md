# Noters

A simple notes app built with the MERN stack. Create, edit and delete notes, with a clean light and dark interface that follows your system setting.

## Tech stack

- **Frontend:** React 19, Vite, React Router, Tailwind CSS 4, daisyUI 5, Geist font
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Rate limiting:** Upstash Redis (100 requests per minute)

## Project structure

```
Noters/
  backend/    Express API (routes, controllers, models, middleware)
  frontend/   React app (pages, components)
```

## Getting started

You need Node.js 20+, a [MongoDB](https://www.mongodb.com/atlas) connection string and an [Upstash Redis](https://upstash.com) database.

### 1. Backend

Create `backend/.env`:

```
MONGODB_URI=<your_mongodb_connection_string>
PORT=5001
UPSTASH_REDIS_REST_URL=<your_upstash_rest_url>
UPSTASH_REDIS_REST_TOKEN=<your_upstash_rest_token>
```

Then run:

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The frontend talks to the API at http://localhost:5001.

## API

| Method | Route            | Description        |
| ------ | ---------------- | ------------------ |
| GET    | `/api/notes`     | List all notes     |
| GET    | `/api/notes/:id` | Get one note       |
| POST   | `/api/notes`     | Create a note      |
| PUT    | `/api/notes/:id` | Update a note      |
| DELETE | `/api/notes/:id` | Delete a note      |

## Production build

From the repo root:

```bash
npm run build
NODE_ENV=production npm start
```

The backend serves the built frontend, so one server runs the whole app.

## Roadmap

- User accounts, so each person sees only their own notes
