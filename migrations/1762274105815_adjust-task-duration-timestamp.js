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
  // Converte o campo duration de integer (segundos) para interval
  // Passo 1: Remove o default antigo (integer)
  pgm.alterColumn("tasks", "duration", {
    default: null,
  });

  // Passo 2: Converte o tipo e os valores existentes: segundos -> interval
  pgm.alterColumn("tasks", "duration", {
    type: "interval",
    notNull: true,
    using: `(duration || ' seconds')::interval`,
  });

  // Passo 3: Adiciona o novo default em formato interval
  pgm.sql(
    `ALTER TABLE tasks ALTER COLUMN duration SET DEFAULT '00:10:00'::interval`
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // Reverte o campo duration de interval para integer (segundos)
  // Passo 1: Remove o default antigo (interval)
  pgm.alterColumn("tasks", "duration", {
    default: null,
  });

  // Passo 2: Converte o tipo e os valores existentes: interval -> segundos
  pgm.alterColumn("tasks", "duration", {
    type: "integer",
    notNull: true,
    using: `EXTRACT(EPOCH FROM duration)::integer`,
  });

  // Passo 3: Adiciona o novo default em formato integer (segundos)
  pgm.alterColumn("tasks", "duration", {
    default: 600, // 600 segundos = 10 minutos
  });
};
