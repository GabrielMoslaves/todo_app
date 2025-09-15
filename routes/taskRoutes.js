const express = require("express");
const {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  getTaskById,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
