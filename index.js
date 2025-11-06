require("dotenv").config();
const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const usersRoutes = require("./routes/usersRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(express.json());

// Middleware CORS manual
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Em produção, substitua '*' pelo domínio do seu cliente
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Responder a requisições OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use("/tasks", taskRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);

app.listen("3030", () => {
  console.log("servidor rodando");
});
