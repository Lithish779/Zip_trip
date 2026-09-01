# Features

Per the challenge instructions, every feature is documented here —
anything not listed here should be assumed unintentional.

## Todos list page (`/`)

- **View all todos** as cards, each showing title, priority, category,
  due date (if any), and completion state.
- **Create a todo** via an inline form (title required; description,
  priority, category, and due date optional). The form validates that a
  title is present before submitting and surfaces backend validation
  errors inline.
- **Mark complete / incomplete** with a single checkbox click (optimistic
  UI update, with automatic rollback if the request fails).
- **Delete a todo** with a confirmation prompt.
- **Search** by title/description text, live-filtered as you type.
- **Filter** by priority, category, and completion status — filters
  combine (e.g. "high priority AND pending").
- **Sort** by newest, due date, priority, or title, in ascending or
  descending order. Todos without a due date always sort to the end when
  sorting by due date, regardless of direction.
- **Stats bar** showing live counts: total, pending, completed, and
  overdue todos. The overdue count is highlighted when non-zero.
- **Overdue indicator**: any pending todo whose due date has passed is
  flagged with a distinct "Overdue" badge, both in the list and on the
  detail page.
- **Empty state** messaging when no todos match the current filters.

## Todo detail page (`/todo?id=<uuid>`)

- Receives the todo's id as a **query parameter**, per the challenge spec.
- Displays the full todo: title, description, priority, category,
  completion status, due date, **created timestamp**, **last-updated
  timestamp**, and the raw todo ID.
- **Edit in place** — reuses the same form component as the create flow,
  pre-filled with the todo's current values.
- **Toggle completion** directly from the detail page.
- **Delete** from the detail page, which redirects back to the list.
- Handles a missing/invalid `id` (shows a message instead of crashing) and
  a `404` from the API (e.g. the todo was deleted in another tab).

## Cross-cutting

- **Client-side + server-side validation**: the form won't submit without
  a title, and the API independently re-validates every write so the
  rules can't be bypassed by calling the API directly.
- **Responsive layout** — usable down to mobile widths.
- **Keyboard-visible focus states** on all interactive elements.
- **Reduced-motion respected** (no motion to disable in this UI beyond
  standard hover/focus transitions, which are skipped under
  `prefers-reduced-motion`).

## Backend-only features (exercised via the API, not all surfaced in the UI)

- **`GET /api/todos/stats/summary`** — aggregate counts endpoint, used by
  the stats bar.
- **Combinable query filters** (`search`, `priority`, `category`,
  `completed`) and **sorting** (`sortBy`, `order`) on `GET /api/todos` —
  see [`API.md`](./API.md) for the full parameter list.
- **Partial updates** via `PUT /api/todos/:id` — you can send just the
  field(s) you want changed.
- Centralized request validation (`models/Todo.js`) shared by create and
  update, so both enforce the same rules (title length, valid priority
  enum, valid date format, etc.).

## Explicitly out of scope

To keep the challenge submission focused, the following were intentionally
left out: user accounts/authentication, multi-user support, drag-and-drop
reordering, and offline support. These would be reasonable next steps for
a production version but weren't part of the brief.
