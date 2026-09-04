import { useEffect, useState, useCallback } from "react";
import { fetchTodos, createTodo, toggleTodo, deleteTodo, fetchStats } from "../api/todos";
import TodoCard from "../components/TodoCard";
import TodoForm from "../components/TodoForm";
import FilterBar from "../components/FilterBar";
import StatsBar from "../components/StatsBar";
import { PlusIcon } from "../components/Icons";

const defaultFilters = {
  search: "",
  priority: "",
  category: "",
  completed: "",
  sortBy: "createdAt",
  order: "desc",
};

export default function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTodos(filters);
      setTodos(data.todos);
    } catch (err) {
      setError("Could not load tasks. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchStats();
      setStats(data);
    } catch {
      // Stats are non-blocking
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    loadStats();
  }, [loadStats, todos]);

  async function handleCreate(payload) {
    await createTodo(payload);
    setShowForm(false);
    loadTodos();
  }

  async function handleToggle(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      await toggleTodo(id);
    } catch {
      loadTodos();
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTodo(id);
    } catch {
      loadTodos();
    }
  }

  return (
    <div className="app-container">
      {/* Top Title & CTA */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Manage your task</h1>
          <p className="page-subtitle">
            Increase your productivity by managing your personal and team tasks
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          <PlusIcon /> {showForm ? "Close Form" : "New Task"}
        </button>
      </div>

      {/* Hero Summary & Category Tiles (Matching Image 2) */}
      <StatsBar stats={stats} onNewTaskClick={() => setShowForm(true)} />

      {/* Form Card Overlay when toggled */}
      {showForm && (
        <div className="form-card">
          <h3 className="form-card-title">Create New Task</h3>
          <TodoForm
            submitLabel="Create Task"
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Search & Filters */}
      <FilterBar filters={filters} onChange={setFilters} />

      {error && <div className="form-error-banner">{error}</div>}

      {/* List Header */}
      <div className="section-heading">
        <h2>Upcoming Task</h2>
        <span className="see-all-link">{todos.length} shown</span>
      </div>

      {/* Empty State */}
      {!loading && todos.length === 0 && !error && (
        <div className="empty-state">
          <p style={{ fontWeight: 600, fontSize: "1.05rem", color: "var(--color-ink)", marginBottom: 4 }}>
            No tasks found
          </p>
          <p>Try clearing your filters or create a new task above.</p>
        </div>
      )}

      {/* Task Cards List */}
      <div className="todo-list-container">
        {todos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
