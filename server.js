import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes("neon")
          ? { rejectUnauthorized: false }
          : false,
      }
    : {
        user: process.env.DB_USER || process.env.PGUSER || "postgres",
        host: process.env.DB_HOST || process.env.PGHOST || "localhost",
        password: process.env.DB_PASSWORD || process.env.PGPASSWORD || "123",
        database: process.env.DB_NAME || process.env.PGDATABASE || "todo_db",
        port: process.env.DB_PORT || process.env.PGPORT || 5432,
      }
);

export { pool };
