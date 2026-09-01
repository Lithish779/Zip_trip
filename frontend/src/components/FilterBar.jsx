import { CATEGORIES, PRIORITIES } from "../constants";

export default function FilterBar({ filters, onChange }) {
  function handleField(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search todos..."
        value={filters.search}
        onChange={(e) => handleField("search", e.target.value)}
        className="filter-search"
      />

      <select
        value={filters.priority}
        onChange={(e) => handleField("priority", e.target.value)}
      >
        <option value="">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p[0].toUpperCase() + p.slice(1)}
          </option>
        ))}
      </select>

      <select
        value={filters.category}
        onChange={(e) => handleField("category", e.target.value)}
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={filters.completed}
        onChange={(e) => handleField("completed", e.target.value)}
      >
        <option value="">All statuses</option>
        <option value="false">Pending</option>
        <option value="true">Completed</option>
      </select>

      <select
        value={filters.sortBy}
        onChange={(e) => handleField("sortBy", e.target.value)}
      >
        <option value="createdAt">Sort: Newest</option>
        <option value="dueDate">Sort: Due date</option>
        <option value="priority">Sort: Priority</option>
        <option value="title">Sort: Title</option>
      </select>

      <button
        type="button"
        className="btn-ghost"
        onClick={() => handleField("order", filters.order === "asc" ? "desc" : "asc")}
        title="Toggle sort order"
      >
        {filters.order === "asc" ? "↑ Asc" : "↓ Desc"}
      </button>
    </div>
  );
}
