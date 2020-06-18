exports.up = function (knex) {
  return knex.schema.alterTable("products", (tbl) => {
    tbl.boolean("active").defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("products", (tbl) => {
    tbl.dropColumn("active");
  });
};
