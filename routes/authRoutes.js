import express from "express";
import authController from "../controllers/authController.js";

const { login, logout, refresh } = authController;

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
