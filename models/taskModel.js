const { pool } = require("../server");

async function getTasks(userId) {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at ASC;",
    [userId]
  );
  return result.rows;
}

async function getTaskById(id) {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE id = $1 AND user_id = $2;",
    [id]
  );
  return result.rows[0];
}

async function createTask(taskData) {
  const { name, status, user_id } = taskData;
  const result = await pool.query(
    "INSERT INTO tasks (name, status, user_id) VALUES ($1, $2, $3) RETURNING *;",
    [name, status, user_id]
  );
  return result.rows[0];
}

async function updateTask(id, taskData) {
  const result = await pool.query(
    "UPDATE tasks SET name = $1, status = $2 WHERE id = $3 AND user_id = $4 RETURNING *;",
    [taskData.name, taskData.status, id, taskData.user_id]
  );
  return result.rows[0];
}

async function deleteTaskById(id, userId) {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *;",
    [id, userId]
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
