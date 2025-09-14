const express = require("express");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());
app.use("/tasks", taskRoutes);

app.listen("3030", () => {
  console.log("abriu");
});
