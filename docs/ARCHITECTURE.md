# Architecture & Design Decisions

A short record of the choices made and why, for anyone reviewing this
submission.

## Monorepo layout

```
ziptrip-todo/
├── backend/    # Express API
├── frontend/   # React (Vite) app
└── docs/        # This file, API.md, FEATURES.md
```

Kept as two independent apps (not a shared workspace/monorepo tool) so
each can be run, installed, and deployed on its own — matching how the
challenge describes them as separate "frontend" and "backend" pieces.

## "Multiple pages, not a SPA"

The brief asks for a multi-page app rather than a single-page experience,
and specifically describes a second page that "receives a query parameter
of todo id." That phrasing (query parameter, not a route param like
`/todos/:id`) is the strongest signal of intent, so the app is built as:

- `/` — the todos list
- `/todo?id=<uuid>` — a single todo, read via `useSearchParams`

This is implemented with `react-router-dom`'s client-side routing, which
is the standard, idiomatic way to build distinct pages in React — a
true multi-page app (full server round-trip per page) isn't how React
apps are built in practice, and isn't what the query-parameter
requirement implies. Each "page" is its own route component with its own
data fetching, so it behaves like a real page (own URL, own loading/error
state, browser back/forward works, refresh works) rather than a modal or
tab hidden in one big component.

## Storage: JSON file over a database

The brief allows either. A flat JSON file (`backend/data/todos.json`,
managed by `backend/utils/fileStore.js`) was chosen so the project runs
immediately for anyone reviewing it — `npm install && npm start` and
there's data, with no MongoDB/Postgres instance to provision or connection
string to configure. Writes are serialized through a promise queue to
avoid corrupting the file under concurrent requests.

## Validation in one place

`backend/models/Todo.js` owns the todo shape and the validation rules
(title required and ≤120 chars, priority must be a known value, dates
must parse). Both `POST` and `PUT` call the same `validateTodoInput`
function, so the rules can't drift between create and update.

## No global state library on the frontend

Each page fetches its own data via `src/api/todos.js` and holds it in
local component state. At this scale (two pages, one resource type) a
global store (Redux/Zustand/Context) would add ceremony without solving
a real problem — prop drilling never goes more than one level deep here.

## Optimistic UI for toggling/deleting

Checking a checkbox or deleting a card updates the UI immediately and
rolls back (re-fetches from the server) only if the request fails, so the
list feels responsive on slower connections.
