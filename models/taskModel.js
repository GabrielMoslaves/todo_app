const { pool } = require("../server");

async function getTasks() {
  const result = await pool.query(
    "SELECT * FROM tasks ORDER BY created_at ASC;"
  );
  return result.rows;
}

async function getTaskById(id) {
  const result = await pool.query("SELECT * FROM tasks WHERE id = $1;", [id]);
  return result.rows[0];
}

async function createTask(taskData) {
  const { name, status } = taskData;
  const result = await pool.query(
    "INSERT INTO tasks (name, status) VALUES ($1, $2) RETURNING *;",
    [name, status]
  );
  return result.rows[0];
}

async function updateTask(id, taskData) {
  const result = await pool.query(
    "UPDATE tasks SET name = $2, status = $3 WHERE id = $1 RETURNING *;",
    [id, taskData.name, taskData.status]
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
  updateTask,
  getTasks,
  createTask,
  deleteTaskById,
  getTaskById,
};

module.exports = taskModel;
