# Ziptrrip Todo — Backend

A Node.js + Express REST API for the Ziptrrip Todo challenge. Data is
persisted to a local JSON file (`data/todos.json`) — no database server
required to run this.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # optional, defaults work out of the box
npm run dev             # nodemon, auto-restarts on file changes
# or
npm start                # plain node
```

The API runs at `http://localhost:5001` by default. A health check is
available at `GET /api/health`.

## Project structure

```
backend/
├── server.js               # app entry point, middleware, error handling
├── routes/todoRoutes.js     # maps HTTP verbs + paths to controller functions
├── controllers/todoController.js  # request handling, filtering, sorting, validation calls
├── models/Todo.js            # todo shape + validation rules
├── utils/fileStore.js        # tiny file-based JSON persistence layer
└── data/todos.json            # the actual data file (seeded with 3 sample todos)
```

## Data persistence

Todos are stored as a JSON array in `data/todos.json`. `utils/fileStore.js`
reads/writes that file directly and serializes writes through a promise
queue so concurrent requests can't corrupt it. This was chosen over
requiring MongoDB/Postgres so the project can be cloned and run immediately
by anyone reviewing it, per the challenge's "save the data in a file or in a
database — either is fine."

## API reference

Full endpoint documentation, including request/response examples, is in
[`/docs/API.md`](../docs/API.md) at the repo root.

Quick summary:

| Method | Path                     | Description                        |
| ------ | ------------------------ | ----------------------------------- |
| GET    | `/api/todos`               | List todos (search/filter/sort)     |
| GET    | `/api/todos/:id`            | Get a single todo                    |
| POST   | `/api/todos`                | Create a todo                        |
| PUT    | `/api/todos/:id`             | Update a todo (partial or full)      |
| PATCH  | `/api/todos/:id/toggle`       | Toggle a todo's completed status     |
| DELETE | `/api/todos/:id`              | Delete a todo                        |
| GET    | `/api/todos/stats/summary`     | Aggregate counts (total, overdue...) |
