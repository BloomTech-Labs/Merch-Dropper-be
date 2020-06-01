exports.up = function(knex) {
  return knex.schema.createTable("products", products => {
    products.increments("id").primary();
    products.string("productName", 255).notNullable();
    products.string("fullSizeURL", 500).notNullable();
    products.string("thumbnailURL", 500).notNullable();
    products.string("description", 500).defaultTo("None");
    products.decimal("price").defaultTo(0);
    products.string('designId').notNullable();
    products.string('color').notNullable();
    products.string('size').notNullable();
    products.string('type').notNullable();
    products
      .integer("storeID")
      .notNullable()
      .references("id")
      .inTable("stores")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    products.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("products");
};
