exports.seed = function(knex) {
  return knex("quotes").insert([
    {
      total: 34.76,
      subtotal: 25.87,
      tax: 2.99,
      fees: 1.26,
      shipping: 4.64,
      orderToken: "70192HJALKANOIAMNL",
      storeID: 1,
      userID: 1
    },
    {
      total: 34.76,
      subtotal: 25.87,
      tax: 2.99,
      fees: 1.26,
      shipping: 4.64,
      orderToken: "TESTTOKEN",
      storeID: 1,
      userID: 1
    }
  ]);
};
