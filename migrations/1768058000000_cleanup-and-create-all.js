/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS refresh_tokens CASCADE;
    DROP TABLE IF EXISTS tasks CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    
    DROP TYPE IF EXISTS task_status CASCADE;
  `);

  // Criar tabela users
  pgm.createTable("users", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    email: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },
    password: {
      type: "varchar(255)",
      notNull: true,
    },
  });

  // Criar enum para status das tasks
  pgm.createType("task_status", ["pending", "in progress", "finished"]);

  // Criar tabela tasks
  pgm.createTable("tasks", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    name: {
      type: "text",
      notNull: true,
    },
    status: {
      type: "task_status",
      notNull: true,
      default: "pending",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "cascade",
    },
    duration: {
      type: "interval",
      notNull: true,
      default: "00:10:00",
    },
    start_time: {
      type: "timestamp",
      notNull: false,
    },
    started: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });

  // Criar tabela refresh_tokens
  pgm.createTable("refresh_tokens", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    token: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "cascade",
    },
    expires_at: {
      type: "timestamp",
      notNull: true,
    },
    revoked: {
      type: "boolean",
      notNull: true,
      default: false,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("refresh_tokens");
  pgm.dropTable("tasks");
  pgm.dropType("task_status");
  pgm.dropTable("users");
};
