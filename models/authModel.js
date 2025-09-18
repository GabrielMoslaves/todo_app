const { pool } = require("../server");

async function getUserByUserName(authData) {
  const { name } = authData;

  const result = await pool.query("SELECT * FROM users WHERE username=$1", [
    name,
  ]);

  const user = result.rows[0];

  return user;
}

const authModel = { getUserByUserName };

module.exports = authModel;
