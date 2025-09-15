const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const usersRoutes = require("./routes/usersRoutes");

const app = express();

app.use(express.json());
app.use("/tasks", taskRoutes);
app.use("/users", usersRoutes);

app.listen("3030", () => {
  console.log("abriu");
});
