const FileStore = require("../utils/fileStore");
const { createTodo, validateTodoInput } = require("../models/Todo");

const store = new FileStore("todos.json");

// GET /api/todos
// Supports query params: search, priority, category, completed, sortBy, order
function getAllTodos(req, res) {
  let todos = store.readAll();
  const { search, priority, category, completed, sortBy, order } = req.query;

  if (search) {
    const q = search.toLowerCase();
    todos = todos.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }

  if (priority) {
    todos = todos.filter((t) => t.priority === priority);
  }

  if (category) {
    todos = todos.filter((t) => t.category === category);
  }

  if (completed !== undefined) {
    const wantCompleted = completed === "true";
    todos = todos.filter((t) => t.completed === wantCompleted);
  }

  const sortableFields = ["createdAt", "updatedAt", "dueDate", "priority", "title"];
  const field = sortableFields.includes(sortBy) ? sortBy : "createdAt";
  const direction = order === "asc" ? 1 : -1;

  const priorityWeight = { low: 1, medium: 2, high: 3 };

  todos.sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];

    if (field === "priority") {
      aVal = priorityWeight[a.priority] || 0;
      bVal = priorityWeight[b.priority] || 0;
    } else if (field === "dueDate") {
      // Todos without a due date always sort last, regardless of direction.
      aVal = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      bVal = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    } else if (field === "createdAt" || field === "updatedAt") {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }

    if (aVal < bVal) return -1 * direction;
    if (aVal > bVal) return 1 * direction;
    return 0;
  });

  res.json({ count: todos.length, todos });
}

// GET /api/todos/:id
function getTodoById(req, res) {
  const todos = store.readAll();
  const todo = todos.find((t) => t.id === req.params.id);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  res.json(todo);
}

// POST /api/todos
async function createTodoHandler(req, res) {
  const errors = validateTodoInput(req.body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const todos = store.readAll();
  const newTodo = createTodo(req.body);
  todos.push(newTodo);
  await store.write(todos);

  res.status(201).json(newTodo);
}

// PUT /api/todos/:id  (partial updates allowed)
async function updateTodo(req, res) {
  const errors = validateTodoInput(req.body, { partial: true });
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const todos = store.readAll();
  const index = todos.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  const updated = {
    ...todos[index],
    ...req.body,
    id: todos[index].id, // id is immutable
    updatedAt: new Date().toISOString(),
  };
  todos[index] = updated;
  await store.write(todos);

  res.json(updated);
}

// PATCH /api/todos/:id/toggle
async function toggleTodo(req, res) {
  const todos = store.readAll();
  const index = todos.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos[index].completed = !todos[index].completed;
  todos[index].updatedAt = new Date().toISOString();
  await store.write(todos);

  res.json(todos[index]);
}

// DELETE /api/todos/:id
async function deleteTodo(req, res) {
  const todos = store.readAll();
  const index = todos.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  const [removed] = todos.splice(index, 1);
  await store.write(todos);

  res.json({ message: "Todo deleted", todo: removed });
}

// GET /api/todos/stats/summary
function getStats(req, res) {
  const todos = store.readAll();
  const now = new Date();

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
    overdue: todos.filter(
      (t) => !t.completed && t.dueDate && new Date(t.dueDate) < now
    ).length,
    byPriority: {
      high: todos.filter((t) => t.priority === "high").length,
      medium: todos.filter((t) => t.priority === "medium").length,
      low: todos.filter((t) => t.priority === "low").length,
    },
  };

  res.json(stats);
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodoHandler,
  updateTodo,
  toggleTodo,
  deleteTodo,
  getStats,
};
