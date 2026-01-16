import express from "express";
import taskController from "../controllers/taskController.js";
import authMiddleware from "../middlewares/auth.js";

const { getTasks, createTask, deleteTask, updateTask, getTaskById } =
  taskController;

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.get("/:id", authMiddleware, getTaskById);
router.post("/", authMiddleware, createTask);
router.patch("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;
