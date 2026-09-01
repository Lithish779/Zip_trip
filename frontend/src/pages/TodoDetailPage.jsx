import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { fetchTodoById, updateTodo, deleteTodo, toggleTodo } from "../api/todos";
import TodoForm from "../components/TodoForm";

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TodoDetailPage() {
  // The spec requires this page to receive the todo id as a query
  // parameter: /todo?id=<uuid>
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const loadTodo = useCallback(async () => {
    if (!id) {
      setError("No todo id was provided in the URL (?id=...).");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchTodoById(id);
      setTodo(data);
    } catch (err) {
      if (err?.response?.status === 404) {
        setError("This todo could not be found. It may have been deleted.");
      } else {
        setError("Could not load this todo. Is the backend running?");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTodo();
  }, [loadTodo]);

  async function handleToggle() {
    const updated = await toggleTodo(id);
    setTodo(updated);
  }

  async function handleUpdate(payload) {
    const updated = await updateTodo(id, payload);
    setTodo(updated);
    setEditing(false);
  }

  async function handleDelete() {
    if (!window.confirm("Delete this todo? This cannot be undone.")) return;
    await deleteTodo(id);
    navigate("/");
  }

  if (loading) {
    return (
      <div className="page">
        <p>Loading todo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="form-error">{error}</p>
        <Link to="/" className="btn-ghost">
          ← Back to all todos
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">
        ← Back to all todos
      </Link>

      {editing ? (
        <div className="card">
          <h2>Edit Todo</h2>
          <TodoForm
            initialValues={{
              title: todo.title,
              description: todo.description,
              priority: todo.priority,
              category: todo.category,
              dueDate: todo.dueDate ? todo.dueDate.slice(0, 10) : "",
            }}
            submitLabel="Save Changes"
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <div className="card todo-detail">
          <div className="page-header">
            <div>
              <h1 className={todo.completed ? "completed-text" : ""}>{todo.title}</h1>
              <div className="todo-meta">
                <span className={`badge badge-${todo.priority}`}>{todo.priority}</span>
                <span className="badge badge-category">{todo.category}</span>
                <span className={`badge ${todo.completed ? "badge-done" : "badge-pending"}`}>
                  {todo.completed ? "Completed" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          {todo.description && <p className="todo-description">{todo.description}</p>}

          <dl className="detail-grid">
            <div>
              <dt>Todo ID</dt>
              <dd className="mono">{todo.id}</dd>
            </div>
            <div>
              <dt>Due date</dt>
              <dd>{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "No due date"}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{formatDateTime(todo.createdAt)}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{formatDateTime(todo.updatedAt)}</dd>
            </div>
          </dl>

          <div className="form-actions">
            <button className="btn-ghost" onClick={handleToggle}>
              Mark as {todo.completed ? "Pending" : "Completed"}
            </button>
            <button className="btn-primary" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button className="btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
