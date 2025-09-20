require("dotenv").config();
const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const usersRoutes = require("./routes/usersRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(express.json());

app.use("/tasks", taskRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);

app.listen("3030", () => {
  console.log("servidor rodando");
});
