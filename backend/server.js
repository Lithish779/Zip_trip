const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const todoRoutes = require("./routes/todoRoutes");

const app = express();
const PORT = process.env.PORT || 5001;
const rawOrigin = process.env.CLIENT_ORIGIN;
const corsOrigin = rawOrigin
  ? rawOrigin.includes(",")
    ? rawOrigin.split(",").map((o) => o.trim())
    : rawOrigin
  : true;

app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "Ziptrrip Todo API is running!",
    health: "/api/health",
    todos: "/api/todos",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/todos", todoRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Ziptrrip Todo API running on http://localhost:${PORT}`);
});
