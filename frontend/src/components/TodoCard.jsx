import { Link } from "react-router-dom";
import { CategoryIcon, CalendarIcon, CheckIcon, TrashIcon } from "./Icons";

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function TodoCard({ todo, onToggle, onDelete }) {
  const isOverdue =
    !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date();

  const catClass = `cat-${(todo.category || "other").toLowerCase()}`;

  return (
    <div className={`todo-card ${todo.completed ? "completed" : ""}`}>
      {/* Custom Animated Checkbox */}
      <div
        className="checkbox-container"
        onClick={() => onToggle(todo.id)}
        role="checkbox"
        aria-checked={todo.completed}
        tabIndex={0}
      >
        <div className="todo-checkbox-custom">
          {todo.completed && <CheckIcon />}
        </div>
      </div>

      {/* Category Icon Badge */}
      <div className={`category-icon-box ${catClass}`}>
        <CategoryIcon category={todo.category} />
      </div>

      {/* Main Info */}
      <div className="todo-main-info">
        <Link to={`/todo?id=${todo.id}`} className="todo-title">
          {todo.title}
        </Link>
        <div className="todo-meta-row">
          <span className={`badge badge-${todo.priority}`}>{todo.priority}</span>
          <span className="badge" style={{ background: "#F1F5F9", color: "#475569" }}>
            {todo.category}
          </span>
          {todo.dueDate && (
            <span className={`badge ${isOverdue ? "badge-overdue" : "badge-date"}`}>
              <CalendarIcon />
              {isOverdue ? "Overdue: " : ""}
              {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="todo-actions">
        <Link to={`/todo?id=${todo.id}`} className="btn-secondary btn-sm">
          View
        </Link>
        <button
          type="button"
          className="btn-danger btn-sm"
          onClick={() => onDelete(todo.id)}
          title="Delete task"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
