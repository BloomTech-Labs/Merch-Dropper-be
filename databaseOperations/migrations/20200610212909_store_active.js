exports.up = function (knex) {
  return knex.schema.alterTable("stores", (tbl) => {
    tbl.boolean("active").defaultTo(false).alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("stores", (tbl) => {
    tbl.boolean("active").defaultTo(true).alter();
  });
};
