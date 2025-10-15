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
  const { name, status, user_id, duration, start_time } = taskData;
  const result = await pool.query(
    "INSERT INTO tasks (name, status, user_id, duration, start_time) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
    [name, status, user_id, duration, start_time]
  );
  return result.rows[0];
}

async function updateTask(id, taskData) {
  const { user_id, ...fields } = taskData;

  const fieldsToUpdate = Object.keys(fields);

  const fieldsString = fieldsToUpdate
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");

  const values = fieldsToUpdate.map((item) => fields[item]);

  const query = `UPDATE tasks SET ${fieldsString} WHERE id = $${
    fieldsToUpdate.length + 1
  } AND user_id = $${fieldsToUpdate.length + 2} RETURNING *;`;

  const result = await pool.query(query, [...values, id, user_id]);
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
