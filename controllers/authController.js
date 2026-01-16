import authModel from "../models/authModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

async function login(req, res) {
  try {
    const { password } = req.body;
    const user = await authModel.getUserByUserEmail(req.body);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const validUser = await bcrypt.compare(password, user.password);
    if (!validUser) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "3m",
    });

    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    await authModel.createRefreshToken(refreshToken, user.id, expiresAt);

    res.json({ accessToken, refreshToken });
  } catch (e) {
    res.status(500).json({ message: "Erro no login", error: e.message });
  }
}

async function refresh(req, res) {
  try {
    const { refresh_token } = req.body;
    const result = await authModel.getRefreshToken(refresh_token);

    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const userId = result.rows[0].user_id;

    const newAccessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    return res.json({ accessToken: newAccessToken });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function logout(req, res) {
  const { refresh_token } = req.body;
  try {
    const result = await authModel.deleteRefreshToken(refresh_token);
    if (result) {
      res.json({ message: "logout successful" });
    } else {
      res.status(400);
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
const authController = {
  login,
  refresh,
  logout,
};

export default authController;
