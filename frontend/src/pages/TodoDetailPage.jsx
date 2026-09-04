import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { fetchTodoById, updateTodo, deleteTodo, toggleTodo } from "../api/todos";
import TodoForm from "../components/TodoForm";
import { BackIcon, CalendarIcon, ClockIcon, TrashIcon, EditIcon } from "../components/Icons";

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatDateOnly(dateStr) {
  if (!dateStr) return "No deadline set";
  return new Date(dateStr).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function TodoDetailPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const loadTodo = useCallback(async () => {
    if (!id) {
      setError("No todo id was provided in the URL query parameter (?id=...).");
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
        setError("This task could not be found. It may have been deleted.");
      } else {
        setError("Could not load task details. Is the backend server running?");
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
    if (!window.confirm("Delete this task? This cannot be undone.")) return;
    await deleteTodo(id);
    navigate("/");
  }

  if (loading) {
    return (
      <div className="app-container">
        <p style={{ padding: "40px 0", textAlign: "center", color: "var(--color-ink-muted)" }}>
          Loading task details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="form-error-banner">{error}</div>
        <Link to="/" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <BackIcon /> Back to tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Back Link */}
      <Link to="/" className="btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <BackIcon /> Back to Task List
      </Link>

      {editing ? (
        <div className="form-card">
          <h2 style={{ marginBottom: 20 }}>Edit Task</h2>
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
        <div className="detail-card">
          {/* Top Info */}
          <div className="detail-header">
            <h1 className={`detail-title ${todo.completed ? "completed-title" : ""}`}>
              {todo.title}
            </h1>

            {/* Date & Time Pills (Matching Image 3 top pills) */}
            <div className="detail-pills-row">
              <span className="detail-pill-badge">
                <CalendarIcon /> {formatDateOnly(todo.dueDate)}
              </span>
              <span className="detail-pill-badge">
                <ClockIcon /> 9:00 AM - 12:00 PM
              </span>
              <span className={`badge badge-${todo.priority}`} style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                {todo.priority} Priority
              </span>
              <span
                className="badge"
                style={{
                  padding: "8px 16px",
                  fontSize: "0.85rem",
                  background: todo.completed ? "var(--color-low-bg)" : "var(--color-medium-bg)",
                  color: todo.completed ? "var(--color-low)" : "var(--color-medium)",
                }}
              >
                {todo.completed ? "Completed" : "Pending"}
              </span>
            </div>
          </div>

          {/* Donut Chart Progress Breakdown (Matching Image 3 middle chart) */}
          <div className="donut-breakdown-card">
            <div className="chart-ring-wrapper">
              <svg width="110" height="110" viewBox="0 0 110 110">
                {/* Segment 1: Finish on time (40% Cyan) */}
                <circle
                  cx="55" cy="55" r="42"
                  stroke="#00C2FF" strokeWidth="12" fill="transparent"
                  strokeDasharray="263" strokeDashoffset="157"
                  transform="rotate(-90 55 55)"
                />
                {/* Segment 2: Past deadline (40% Coral) */}
                <circle
                  cx="55" cy="55" r="42"
                  stroke="#FF6B4A" strokeWidth="12" fill="transparent"
                  strokeDasharray="263" strokeDashoffset="157"
                  transform="rotate(54 55 55)"
                />
                {/* Segment 3: Still ongoing (20% Blue) */}
                <circle
                  cx="55" cy="55" r="42"
                  stroke="#3B82F6" strokeWidth="12" fill="transparent"
                  strokeDasharray="263" strokeDashoffset="210"
                  transform="rotate(198 55 55)"
                />
              </svg>
              <span className="chart-ring-label">{todo.completed ? "100%" : "40%"}</span>
            </div>

            <div className="donut-legend">
              <div className="legend-item">
                <span className="dot dot-cyan"></span>
                <span>40% Finish on time</span>
              </div>
              <div className="legend-item">
                <span className="dot dot-orange"></span>
                <span>40% Past the deadline</span>
              </div>
              <div className="legend-item">
                <span className="dot dot-blue"></span>
                <span>20% Still ongoing</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="detail-description-box">
            <h4>Description</h4>
            <div className="detail-description-text">
              {todo.description ||
                "Task management is the process which is monitoring your fast project's tasks through their various stages from start to finish."}
            </div>
          </div>

          {/* Sub Task / Metadata Grid */}
          <h4 style={{ marginBottom: 12 }}>Task Details</h4>
          <dl className="detail-grid">
            <div className="detail-grid-item">
              <dt>Task Unique ID</dt>
              <dd className="mono-id">{todo.id}</dd>
            </div>
            <div className="detail-grid-item">
              <dt>Category</dt>
              <dd>{todo.category}</dd>
            </div>
            <div className="detail-grid-item">
              <dt>Created Timestamp</dt>
              <dd>{formatDateTime(todo.createdAt)}</dd>
            </div>
            <div className="detail-grid-item">
              <dt>Last Updated</dt>
              <dd>{formatDateTime(todo.updatedAt)}</dd>
            </div>
          </dl>

          {/* Actions */}
          <div className="form-actions-row">
            <button className="btn-secondary" onClick={handleToggle}>
              Mark as {todo.completed ? "Pending" : "Completed"}
            </button>
            <button className="btn-primary" onClick={() => setEditing(true)}>
              <EditIcon /> Edit Task
            </button>
            <button className="btn-danger" onClick={handleDelete}>
              <TrashIcon /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
