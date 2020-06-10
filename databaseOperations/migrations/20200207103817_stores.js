exports.up = function (knex) {
  return knex.schema.createTable("stores", (stores) => {
    stores.increments("id").primary();
    stores.boolean("active").defaultTo(true);
    stores.string("store_name", 255).unique().notNullable();
    stores.string("domain_name", 255).unique().notNullable();
    stores
      .string("hero_ImageURL", 255)
      .defaultTo(
        "https://www.dalesjewelers.com/wp-content/uploads/2018/10placeholder-silhouette-male.png"
      )
      .notNullable();
    stores
      .string("logo_url", 255)
      .defaultTo("https://uxmasters.org/images/ant_logo.svg")
      .notNullable();
    stores.timestamps(true, true);
    stores
      .integer("userID")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("stores");
};
