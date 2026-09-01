# API Reference

Base URL: `http://localhost:5001/api`

All request/response bodies are JSON. There is no authentication — this is
a self-contained coding challenge, not a production service.

---

## Todo object

```json
{
  "id": "d1a1f7b0-1a2b-4c3d-8e4f-000000000001",
  "title": "Finish Ziptrrip todo challenge",
  "description": "Build the frontend, backend, and docs.",
  "priority": "high",
  "category": "Work",
  "dueDate": "2026-09-05",
  "completed": false,
  "createdAt": "2026-08-25T09:00:00.000Z",
  "updatedAt": "2026-08-25T09:00:00.000Z"
}
```

| Field         | Type                          | Notes                                             |
| ------------- | ------------------------------ | -------------------------------------------------- |
| `id`          | string (UUID)                  | Generated server-side, immutable                   |
| `title`       | string, required, ≤120 chars   | The only required field                            |
| `description` | string                          | Optional, defaults to `""`                          |
| `priority`    | `"low" \| "medium" \| "high"`  | Defaults to `"medium"`                              |
| `category`    | string                          | Defaults to `"Other"`                               |
| `dueDate`     | ISO date string or `null`       | Optional                                            |
| `completed`   | boolean                         | Defaults to `false`                                  |
| `createdAt`   | ISO datetime string              | Set once, on creation                                |
| `updatedAt`   | ISO datetime string              | Refreshed on every update or toggle                  |

---

## `GET /api/todos`

List todos. All query parameters are optional and combine (AND'd together).

| Param       | Example                | Effect                                                             |
| ----------- | ----------------------- | -------------------------------------------------------------------- |
| `search`    | `?search=grocery`         | Case-insensitive match against title + description                  |
| `priority`  | `?priority=high`           | Exact match                                                          |
| `category`  | `?category=Work`            | Exact match                                                          |
| `completed` | `?completed=true`            | `"true"` or `"false"`                                                |
| `sortBy`    | `?sortBy=dueDate`             | One of `createdAt` (default), `updatedAt`, `dueDate`, `priority`, `title` |
| `order`     | `?order=asc`                    | `"asc"` or `"desc"` (default)                                        |

**Response `200`**

```json
{ "count": 2, "todos": [ { ... }, { ... } ] }
```

---

## `GET /api/todos/:id`

**Response `200`** — a single todo object.
**Response `404`** — `{ "error": "Todo not found" }`

---

## `POST /api/todos`

**Body**

```json
{
  "title": "Buy milk",
  "description": "2% please",
  "priority": "low",
  "category": "Shopping",
  "dueDate": "2026-09-10"
}
```

Only `title` is required; everything else falls back to its default.

**Response `201`** — the created todo.
**Response `400`** — `{ "errors": ["title is required and must be a non-empty string"] }`

---

## `PUT /api/todos/:id`

Partial updates are allowed — send only the fields you want to change.

**Body** (example)

```json
{ "completed": true, "priority": "high" }
```

**Response `200`** — the updated todo.
**Response `400` / `404`** — validation errors or not-found, same shape as above.

---

## `PATCH /api/todos/:id/toggle`

Flips `completed` without needing to know its current value. No body required.

**Response `200`** — the updated todo.

---

## `DELETE /api/todos/:id`

**Response `200`**

```json
{ "message": "Todo deleted", "todo": { ...the deleted todo... } }
```

---

## `GET /api/todos/stats/summary`

Aggregate counts, used to power the stats bar on the list page.

**Response `200`**

```json
{
  "total": 5,
  "completed": 2,
  "pending": 3,
  "overdue": 1,
  "byPriority": { "high": 2, "medium": 2, "low": 1 }
}
```

---

## `GET /api/health`

Simple liveness check.

**Response `200`** — `{ "status": "ok", "timestamp": "..." }`

---

## Errors

Unhandled routes return `404` with `{ "error": "Route <METHOD> <path> not found" }`.
Unexpected server errors return `500` with `{ "error": "Internal server error" }`.
