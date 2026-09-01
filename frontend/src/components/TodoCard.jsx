import { Link } from "react-router-dom";

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TodoCard({ todo, onToggle, onDelete }) {
  const isOverdue =
    !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date();

  return (
    <div className={`todo-card priority-${todo.priority} ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
        aria-label={`Mark "${todo.title}" as ${todo.completed ? "pending" : "completed"}`}
      />

      <div className="todo-main">
        {/* This is the required "second page" navigation: the todo id
            is passed as a query parameter, e.g. /todo?id=<uuid> */}
        <Link to={`/todo?id=${todo.id}`} className="todo-title">
          {todo.title}
        </Link>
        <div className="todo-meta">
          <span className={`badge badge-${todo.priority}`}>{todo.priority}</span>
          <span className="badge badge-category">{todo.category}</span>
          {todo.dueDate && (
            <span className={`badge ${isOverdue ? "badge-overdue" : "badge-due"}`}>
              {isOverdue ? "Overdue: " : "Due "}
              {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <Link to={`/todo?id=${todo.id}`} className="btn-ghost small">
          View
        </Link>
        <button
          type="button"
          className="btn-danger small"
          onClick={() => onDelete(todo.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
