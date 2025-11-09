import { pool } from "../server.js";
import bcrypt from "bcrypt";

async function getUsers() {
  const result = await pool.query("SELECT * FROM users;");
  return result.rows;
}

async function createUser(userData) {
  const password = await bcrypt.hash(userData.password, 10);
  const result = await pool.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;",
    [userData.email, password]
  );
  return result.rows[0];
}

async function updateUser(userData, id) {
  const password = userData.password
    ? await bcrypt.hash(userData.password, 10)
    : userData.password;

  const result = await pool.query(
    "UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING *;",
    [userData.email, password, id]
  );
  return result.rows[0];
}

async function deleteUser(id) {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *;",
    [id]
  );
  return result.rows[0];
}

const userModel = {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
};

export default userModel;
