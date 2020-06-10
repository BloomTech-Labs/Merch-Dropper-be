exports.seed = function(knex) {
  return knex("stores").insert([
    {
      active: false,
      store_name: "Anthill Store",
      userID: 1,
      domain_name: "anthillstore"
    },
    {
      active: false,
      store_name: "The Best Store",
      userID: 2,
      domain_name: "TheBestStore"
    }
  ]);
};
