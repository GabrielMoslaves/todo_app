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
  // Criar sequence para users.id se não existir
  pgm.sql(`
    CREATE SEQUENCE IF NOT EXISTS users_id_seq;
  `);

  // Criar tabela users se não existir (estrutura inicial - antes de renomear para email)
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS users (
      id integer PRIMARY KEY DEFAULT nextval('users_id_seq'::regclass),
      username varchar(255) NOT NULL UNIQUE,
      password varchar(255) NOT NULL
    );
  `);

  // Garantir que a sequence está owned pela tabela
  pgm.sql(`
    ALTER SEQUENCE users_id_seq OWNED BY users.id;
  `);

  // Criar sequence para tasks.id se não existir
  pgm.sql(`
    CREATE SEQUENCE IF NOT EXISTS tasks_id_seq;
  `);

  // Criar tabela tasks se não existir (estrutura inicial - apenas campos básicos)
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS tasks (
      id integer PRIMARY KEY DEFAULT nextval('tasks_id_seq'::regclass),
      name text NOT NULL,
      status text NOT NULL DEFAULT 'pending',
      created_at timestamp DEFAULT now()
    );
  `);

  // Garantir que a sequence está owned pela tabela
  pgm.sql(`
    ALTER SEQUENCE tasks_id_seq OWNED BY tasks.id;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("tasks");
  pgm.dropTable("users");
};

