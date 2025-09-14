const { pool } = require("../server");

async function getTasks() {
  const result = await pool.query("SELECT * FROM tasks;");
  return result.rows;
}

async function createTask(taskData) {
  const { name, status } = taskData;
  const result = await pool.query(
    "INSERT INTO tasks (name, status) VALUES ($1, $2) RETURNING *;",
    [name, status]
  );
  return result.rows[0];
}

async function deleteTaskById(id) {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 RETURNING *;",
    [id]
  );
  return result.rows[0];
}

const taskModel = {
  getTasks,
  createTask,
  deleteTaskById,
};

module.exports = taskModel;
