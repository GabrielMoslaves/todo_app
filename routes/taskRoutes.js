const express = require("express");
const {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  getTaskById,
} = require("../controllers/taskController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.get("/:id", authMiddleware, getTaskById);
router.post("/", authMiddleware, createTask);
router.patch("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
