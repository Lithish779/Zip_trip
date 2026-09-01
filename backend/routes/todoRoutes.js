const express = require("express");
const router = express.Router();
const controller = require("../controllers/todoController");

// Order matters: /stats/summary must be declared before /:id
// or "stats" would be swallowed as an :id param.
router.get("/stats/summary", controller.getStats);

router.get("/", controller.getAllTodos);
router.get("/:id", controller.getTodoById);
router.post("/", controller.createTodoHandler);
router.put("/:id", controller.updateTodo);
router.patch("/:id/toggle", controller.toggleTodo);
router.delete("/:id", controller.deleteTodo);

module.exports = router;
