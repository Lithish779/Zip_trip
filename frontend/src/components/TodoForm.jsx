import { useState } from "react";
import { CATEGORIES, PRIORITIES } from "../constants";

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  category: "Other",
  dueDate: "",
};

export default function TodoForm({ initialValues, submitLabel = "Add Todo", onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        dueDate: form.dueDate || null,
      });
      if (!initialValues) {
        setForm(emptyForm); // reset after creating a new todo
      }
    } catch (err) {
      setError(err?.response?.data?.errors?.join(", ") || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}

      <div className="form-row">
        <label>
          Title *
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="What needs to be done?"
            maxLength={120}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Add more detail (optional)"
            rows={3}
          />
        </label>
      </div>

      <div className="form-row form-row-grid">
        <label>
          Priority
          <select
            value={form.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p[0].toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Category
          <select
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Due date
          <input
            type="date"
            value={form.dueDate || ""}
            onChange={(e) => handleChange("dueDate", e.target.value)}
          />
        </label>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
