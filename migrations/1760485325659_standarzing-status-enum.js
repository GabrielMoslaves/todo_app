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
  pgm.createType("task_status", ["pending", "in progress", "finished"]);

  // Primeiro, remover o default antigo
  pgm.alterColumn("tasks", "status", {
    default: null,
  });

  // Depois, alterar o tipo da coluna
  pgm.alterColumn("tasks", "status", {
    type: "task_status",
    using: `CASE 
        WHEN status = 'pending' THEN 'pending'::task_status
        WHEN status = 'in progress' THEN 'in progress'::task_status
        WHEN status = 'finished' THEN 'finished'::task_status
        ELSE 'pending'::task_status
        END`,
    notNull: true,
  });

  // Por fim, adicionar o default com o tipo correto
  pgm.sql(`ALTER TABLE tasks ALTER COLUMN status SET DEFAULT 'pending'::task_status`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
