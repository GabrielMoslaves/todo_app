import { pool } from "../server.js";

async function getTasks(userId) {
  const result = await pool.query(
    `SELECT 
      id, 
      name, 
      status, 
      created_at, 
      user_id, 
      TO_CHAR(duration, 'HH24:MI') as duration, 
      start_time,
      started
    FROM tasks WHERE user_id = $1 ORDER BY created_at ASC;`,
    [userId],
  );
  return result.rows;
}

async function getTaskById(id) {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE id = $1 AND user_id = $2;",
    [id],
  );
  return result.rows[0];
}

async function createTask(taskData) {
  const { name, user_id, duration, start_time } = taskData;
  const result = await pool.query(
    "INSERT INTO tasks (name, user_id, duration, start_time) VALUES ($1, $2, ($3 || ':00')::interval, $4) RETURNING id, name, status, started,created_at, user_id, TO_CHAR(duration, 'HH24:MI') as duration, start_time;",
    [name, user_id, duration, start_time],
  );
  return result.rows[0];
}

async function updateTask(id, taskData) {
  const { user_id, ...fields } = taskData;

  const fieldsToUpdate = Object.keys(fields);

  const durationIndex = fieldsToUpdate.indexOf("duration");
  if (durationIndex !== -1) {
    fieldsToUpdate[durationIndex] = `($${
      durationIndex + 1
    } || ':00')::interval`;
  }

  const fieldsString = fieldsToUpdate
    .map((field, index) => {
      if (field.includes("::interval")) {
        return `duration = ${field}`;
      }
      return `${field} = $${index + 1}`;
    })
    .join(", ");

  const values = Object.keys(fields).map((item) => fields[item]);

  const query = `UPDATE tasks SET ${fieldsString} WHERE id = $${
    values.length + 1
  } AND user_id = $${
    values.length + 2
  } RETURNING id, name, status, started, created_at, user_id, TO_CHAR(duration, 'HH24:MI') as duration, start_time;`;

  const result = await pool.query(query, [...values, id, user_id]);
  return result.rows[0];
}

async function deleteTaskById(id, userId) {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id, name, status, started, created_at, user_id, TO_CHAR(duration, 'HH24:MI') as duration, start_time;",
    [id, userId],
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

export default taskModel;
