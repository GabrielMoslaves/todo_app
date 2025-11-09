import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  password: process.env.DB_PASSWORD || "123",
  database: process.env.DB_NAME || "todo_db",
  port: process.env.DB_PORT || 5432,
});

export { pool };
