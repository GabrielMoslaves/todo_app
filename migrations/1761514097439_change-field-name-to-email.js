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
  pgm.renameColumn("users", "username", "email");

  pgm.alterColumn("users", "email", {
    type: "varchar(255)",
    notNull: true,
    unique: true,
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.alterColumn("users", "email", {
    type: "varchar(255)",
    notNull: true,
    unique: false,
  });

  pgm.renameColumn("users", "email", "username");
};
