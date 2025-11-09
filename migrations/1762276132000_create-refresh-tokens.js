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
  pgm.createTable("refresh_tokens", {
    id: {
      type: "integer",
      primaryKey: true,
      notNull: true,
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

  // Criar sequence para refresh_tokens.id
  pgm.sql("CREATE SEQUENCE IF NOT EXISTS refresh_tokens_id_seq");
  pgm.sql(
    "ALTER TABLE refresh_tokens ALTER COLUMN id SET DEFAULT nextval('refresh_tokens_id_seq'::regclass)"
  );
  pgm.sql("ALTER SEQUENCE refresh_tokens_id_seq OWNED BY refresh_tokens.id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("refresh_tokens");
};

