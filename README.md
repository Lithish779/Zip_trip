# Ziptrrip Todo

A full-stack todo application built for the Ziptrrip "Challenge Intern"
tech assignment: a multi-page React frontend backed by a Node.js/Express
REST API, with data persisted to a JSON file.

## Stack

| Layer     | Technology                                    |
| --------- | ---------------------------------------------- |
| Frontend  | React 19 (Vite), react-router-dom, axios        |
| Backend   | Node.js, Express                                 |
| Storage   | JSON file (`backend/data/todos.json`)             |

## Quick start

Requires Node.js 18+. Two terminals — the API and the app run separately.

```bash
# Terminal 1 — backend, http://localhost:5001
cd backend
npm install
npm run dev

# Terminal 2 — frontend, http://localhost:5173
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173`. The app ships with 3 seed todos so the
list isn't empty on first load.

No database setup, environment variables, or API keys are required — the
`.env.example` files in each folder are optional overrides (e.g. to point
the frontend at a different API URL or run the backend on a different
port).

## What's implemented

- **Two distinct pages**: a todos list (`/`) and a single-todo detail page
  (`/todo?id=<uuid>`) that reads the todo id from a query parameter, as
  specified in the brief.
- **Full CRUD** for todos, both in the UI and as REST endpoints.
- **Search, filter (priority / category / status), and sort** on the list
  page.
- **Extra fields per todo** beyond the bare minimum: description,
  priority, category, due date, created/updated timestamps — all shown on
  the detail page.
- **Stats summary** (total / pending / completed / overdue) via a
  dedicated API endpoint.

Full feature list: [`docs/FEATURES.md`](./docs/FEATURES.md)
Full API reference: [`docs/API.md`](./docs/API.md)
Design decisions: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
Per-package setup detail: [`frontend/README.md`](./frontend/README.md),
[`backend/README.md`](./backend/README.md)

## Project structure

```
ziptrip-todo/
├── backend/
│   ├── server.js
│   ├── routes/todoRoutes.js
│   ├── controllers/todoController.js
│   ├── models/Todo.js
│   ├── utils/fileStore.js
│   └── data/todos.json
├── frontend/
│   └── src/
│       ├── api/todos.js
│       ├── components/
│       ├── pages/
│       └── App.jsx
└── docs/
    ├── FEATURES.md
    ├── API.md
    └── ARCHITECTURE.md
```

## Mapping to the brief

| Requirement                                                | Where                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------- |
| Basic React app, multi-page (not SPA)                        | `frontend/`, two routed pages — see `docs/ARCHITECTURE.md`     |
| Todos list page with features                                | `frontend/src/pages/TodoListPage.jsx`                          |
| Single-todo page, id via query parameter                     | `frontend/src/pages/TodoDetailPage.jsx` (`/todo?id=...`)        |
| Node.js + Express backend                                    | `backend/server.js`                                             |
| CRUD APIs for todos                                          | `backend/routes/todoRoutes.js`, `backend/controllers/`           |
| Data saved to a file or database                             | `backend/data/todos.json` via `backend/utils/fileStore.js`      |
| Documentation in `.md` files in the repo                      | This file + everything under `docs/`                             |
