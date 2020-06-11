exports.up = function (knex) {
  return knex.schema.createTable("quotes", (quotes) => {
    quotes.increments("id").primary();
    quotes.decimal("total", null).notNullable();
    quotes.decimal("subtotal", null).notNullable();
    quotes.decimal("tax", null).notNullable();
    quotes.decimal("fees", null).notNullable();
    quotes.decimal("shipping", null).notNullable();
    quotes.string("orderToken", 255).unique().notNullable();
    quotes.string("warnings", 255).defaultTo("-");
    quotes.string("mode", 255).notNullable().defaultTo("-");
    quotes
      .integer("storeID")
      .notNullable()
      .references("id")
      .inTable("stores")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    quotes
      .integer("userID")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("quotes");
};
