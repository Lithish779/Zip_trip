import { useState } from "react";
import { CATEGORIES, PRIORITIES } from "../constants";

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  category: "Other",
  dueDate: "",
};

export default function TodoForm({ initialValues, submitLabel = "Add Task", onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Task title is required.");
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
        setForm(emptyForm);
      }
    } catch (err) {
      setError(err?.response?.data?.errors?.join(", ") || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      {error && <div className="form-error-banner">{error}</div>}

      <div className="form-group">
        <label>Task Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g. User experience design..."
          maxLength={120}
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Add detailed task notes or subtasks..."
          rows={3}
        />
      </div>

      <div className="form-group form-grid-3">
        <div>
          <label>Priority</label>
          <select
            value={form.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p[0].toUpperCase() + p.slice(1)} Priority
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Category</label>
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
        </div>

        <div>
          <label>Due Date</label>
          <input
            type="date"
            value={form.dueDate || ""}
            onChange={(e) => handleChange("dueDate", e.target.value)}
          />
        </div>
      </div>

      <div className="form-actions-row">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
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
