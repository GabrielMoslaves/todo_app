const { pool } = require("../server");

async function getUserByUserEmail(authData) {
  const { email } = authData;
  const result = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);

  const user = result.rows[0];

  return user;
}

async function createRefreshToken(token, userId, expiresAt) {
  const result = await pool.query(
    "INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3);",
    [token, userId, expiresAt]
  );

  return result.rows[0];
}

async function getRefreshToken(refreshToken) {
  const result = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token = $1 AND revoked = FALSE AND expires_at > now()",
    [refreshToken]
  );

  return result;
}

async function deleteRefreshToken(refreshToken) {
  const result = await pool.query(
    "DELETE FROM refresh_tokens WHERE token = $1 RETURNING *",
    [refreshToken]
  );

  return result;
}

const authModel = {
  getUserByUserEmail,
  createRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
};

module.exports = authModel;
