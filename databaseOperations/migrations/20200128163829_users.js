exports.up = function (knex) {
  return knex.schema.createTable("users", (users) => {
    users.increments("id").primary();
    users.string("first_name", 255);
    users.string("last_name", 255);
    users.string("username", 255).unique();
    users.string("password", 255).notNullable();
    users.boolean("seller").defaultTo(false).notNullable();
    users.string("stripe_account", 255);
    users.string("address1", 255);
    users.string("address2", 255).defaultTo("-");
    users.string("city", 255);
    users.string("state", 255);
    users.integer("zip_code");
    users.string("country", 255);
    users.bigint("phone");
    users.string("email", 255).notNullable();
    users.string("billing_address", 255);
    users.string("billing_city", 255);
    users.string("billing_state", 255);
    users.string("billing_zip_code", 255);
    users.string("billing_country", 255);
    users.string("shipping_address", 255);
    users.string("shipping_city", 255);
    users.string("shipping_state", 255);
    users.string("shipping_zip_code", 255);
    users.string("shipping_country", 255);
    users.string("support_pin", 10);
    users.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
