# Ziptrrip Todo — Frontend

A multi-page React application (React Router, not a single "everything on one
screen" SPA view) for managing todos.

## Pages

| Route          | Component         | Purpose                                                          |
| -------------- | ------------------ | ----------------------------------------------------------------- |
| `/`            | `TodoListPage`      | Browse, search, filter, sort, create, complete, and delete todos |
| `/todo?id=...` | `TodoDetailPage`    | View/edit a single todo, identified by an `id` query parameter   |
| `*`            | `NotFoundPage`       | Fallback for unknown routes                                      |

Both pages are separate route components rendered by `react-router-dom`,
navigated to via real URL changes (`/` and `/todo?id=<uuid>`) rather than
client-side modal/tab state — satisfying the "multiple pages" requirement
while still being a modern React app.

## Tech

- **Vite + React 19**
- **react-router-dom** for routing
- **axios** for API calls (`src/api/todos.js`)
- Plain CSS (design tokens in `src/index.css`, components in `src/App.css`) — no UI framework

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # only needed if your API isn't on localhost:5000
npm run dev
```

The app runs at `http://localhost:5173` and expects the backend at the URL
in `VITE_API_URL` (defaults to `http://localhost:5000/api`).

## Project structure

```
src/
├── api/todos.js          # all HTTP calls to the backend, in one place
├── components/            # Navbar, TodoCard, TodoForm, FilterBar, StatsBar
├── pages/                 # TodoListPage, TodoDetailPage, NotFoundPage
├── constants.js           # shared priority/category options
├── App.jsx                # router setup
├── App.css / index.css    # styling
└── main.jsx                # entry point
```

## Build

```bash
npm run build   # outputs static files to dist/
npm run preview # serve the production build locally
```

See [`/docs/FEATURES.md`](../docs/FEATURES.md) at the repo root for the full
feature list.
