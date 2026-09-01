import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const client = axios.create({ baseURL: BASE_URL });

// Builds a query string from a filters object, skipping empty values.
function toQueryString(params = {}) {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
  return new URLSearchParams(cleaned).toString();
}

export async function fetchTodos(filters = {}) {
  const qs = toQueryString(filters);
  const { data } = await client.get(`/todos${qs ? `?${qs}` : ""}`);
  return data; // { count, todos }
}

export async function fetchTodoById(id) {
  const { data } = await client.get(`/todos/${id}`);
  return data;
}

export async function createTodo(payload) {
  const { data } = await client.post("/todos", payload);
  return data;
}

export async function updateTodo(id, payload) {
  const { data } = await client.put(`/todos/${id}`, payload);
  return data;
}

export async function toggleTodo(id) {
  const { data } = await client.patch(`/todos/${id}/toggle`);
  return data;
}

export async function deleteTodo(id) {
  const { data } = await client.delete(`/todos/${id}`);
  return data;
}

export async function fetchStats() {
  const { data } = await client.get("/todos/stats/summary");
  return data;
}
