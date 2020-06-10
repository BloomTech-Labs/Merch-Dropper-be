exports.up = function (knex) {
  return knex.schema.createTable("orders", (orders) => {
    orders.increments("id").primary();
    orders.string("status", 255).notNullable();
    orders.decimal("total", null).notNullable();
    orders.decimal("subtotal", null).notNullable();
    orders.decimal("tax", null).notNullable();
    orders.decimal("fees", null).notNullable();
    orders.decimal("shipping", null).notNullable();
    orders.string("orderToken", 255).unique().notNullable();
    orders.string("spOrderID", 255).notNullable();
    orders.string("mode", 255).notNullable();
    orders.string("orderedAt", 255).notNullable();
    orders.timestamps(true, true);
    orders
      .integer("storeID")
      .notNullable()
      .references("id")
      .inTable("stores")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    orders
      .integer("userID")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("orders");
};
