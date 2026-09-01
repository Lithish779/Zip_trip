import { useEffect, useState, useCallback } from "react";
import { fetchTodos, createTodo, toggleTodo, deleteTodo, fetchStats } from "../api/todos";
import TodoCard from "../components/TodoCard";
import TodoForm from "../components/TodoForm";
import FilterBar from "../components/FilterBar";
import StatsBar from "../components/StatsBar";

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
      setError("Could not load todos. Is the backend running on port 5000?");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchStats();
      setStats(data);
    } catch {
      // Stats are a nice-to-have; a failure here shouldn't block the page.
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
    // Optimistic update for a snappier feel.
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      await toggleTodo(id);
    } catch {
      loadTodos(); // revert to server truth on failure
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this todo? This cannot be undone.")) return;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTodo(id);
    } catch {
      loadTodos();
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Your Todos</h1>
          <p className="page-subtitle">
            {loading ? "Loading..." : `${todos.length} shown`}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Close" : "+ New Todo"}
        </button>
      </div>

      <StatsBar stats={stats} />

      {showForm && (
        <div className="card">
          <TodoForm submitLabel="Add Todo" onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <FilterBar filters={filters} onChange={setFilters} />

      {error && <p className="form-error">{error}</p>}

      {!loading && todos.length === 0 && !error && (
        <div className="empty-state">
          <p>No todos match your filters yet.</p>
        </div>
      )}

      <div className="todo-list">
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
