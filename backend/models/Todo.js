const { v4: uuidv4 } = require("uuid");

const PRIORITIES = ["low", "medium", "high"];
const CATEGORIES = ["Personal", "Work", "Study", "Shopping", "Health", "Other"];

/**
 * Todo shape:
 * {
 *   id: string (uuid),
 *   title: string,
 *   description: string,
 *   priority: "low" | "medium" | "high",
 *   category: string,
 *   dueDate: string (ISO date) | null,
 *   completed: boolean,
 *   createdAt: string (ISO datetime),
 *   updatedAt: string (ISO datetime)
 * }
 */

function createTodo({ title, description, priority, category, dueDate, progress }) {
  const now = new Date().toISOString();
  const parsedProgress = Number(progress);
  const validProgress = !isNaN(parsedProgress) ? Math.min(100, Math.max(0, Math.round(parsedProgress))) : 0;
  return {
    id: uuidv4(),
    title: title.trim(),
    description: description ? description.trim() : "",
    priority: PRIORITIES.includes(priority) ? priority : "medium",
    category: category && category.trim() ? category.trim() : "Other",
    dueDate: dueDate || null,
    progress: validProgress,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}

function validateTodoInput(body, { partial = false } = {}) {
  const errors = [];

  if (!partial || body.title !== undefined) {
    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      errors.push("title is required and must be a non-empty string");
    } else if (body.title.trim().length > 120) {
      errors.push("title must be 120 characters or fewer");
    }
  }

  if (body.priority !== undefined && !PRIORITIES.includes(body.priority)) {
    errors.push(`priority must be one of: ${PRIORITIES.join(", ")}`);
  }

  if (body.dueDate !== undefined && body.dueDate !== null) {
    const parsed = new Date(body.dueDate);
    if (Number.isNaN(parsed.getTime())) {
      errors.push("dueDate must be a valid date string");
    }
  }

  if (body.completed !== undefined && typeof body.completed !== "boolean") {
    errors.push("completed must be a boolean");
  }

  if (body.progress !== undefined && body.progress !== null) {
    const p = Number(body.progress);
    if (isNaN(p) || p < 0 || p > 100) {
      errors.push("progress must be a number between 0 and 100");
    }
  }

  return errors;
}

module.exports = { createTodo, validateTodoInput, PRIORITIES, CATEGORIES };
