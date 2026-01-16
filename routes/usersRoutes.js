import express from "express";
import userController from "../controllers/usersController.js";

const { getUsers, createUser, deleteUser, updateUser } = userController;

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.patch("/:id", updateUser);

export default router;
