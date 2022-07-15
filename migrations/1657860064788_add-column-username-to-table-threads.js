/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // menambah kolom username terhadap tabel threads
  pgm.addColumn("threads", {
    owner: {
      type: "VARCHAR(50)",
    },
    date: {
      type: "TEXT",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint(
    "threads",
    "fk_threads.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("threads", "fk_threads.username_users.id");
  pgm.dropColumn("threads", "username");
  pgm.dropColumn("threads", "date");
};
