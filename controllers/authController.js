const authModel = require("../models/authModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function login(req, res) {
  const { password } = req.body;
  try {
    const user = await authModel.getUserByUserName(req.body);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const validUser = await bcrypt.compare(password, user.password);
    if (!validUser) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (e) {
    res.status(500).json({ message: "Erro no login", error: e.message });
    console.error(e);
  }
}

const authController = {
  login,
};

module.exports = authController;
