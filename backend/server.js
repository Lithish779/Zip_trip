const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const todoRoutes = require("./routes/todoRoutes");

const app = express();
const PORT = process.env.PORT || 5001;
const defaultOrigins = [
  "https://zip-trip-brown.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];
const rawOrigin = process.env.CLIENT_ORIGIN;
const envOrigins = rawOrigin
  ? rawOrigin.split(",").map((o) => o.trim())
  : [];
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
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
