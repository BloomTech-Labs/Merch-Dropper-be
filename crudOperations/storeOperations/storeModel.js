const db = require("../../databaseOperations/db-config");

module.exports = {
  // insertStoreUsers,
  // getStoresUsers
};

//FUTURE RELEASE////////////// lets a store have multiple users
// function insertStoreUsers(store_name, username) {
//   return db("users_store")
//     .insert({ store_name, username, admin: true })

//     .then(res => {
//       console.log(res);
//     })
//     .catch(error => {
//       res.status(500).json({
//         error,
//         message:
//           "Unable to add this into user_party Table, its not you.. its me"
//       });
//     });
// }

// function getStoresUsers(store_name) {
//   return db("users_store")
//     .select(
//       "username",
//       "store_name",
//       "admin",

//       "stores.active",
//       "stores.store_name",
//       "stores.hero_imageURL",
//       "stores.logo_url",

//       "users.username",
//       "users.first_name",
//       "users.last_name",
//       "users.stripe_account",
//       "users.address1",
//       "users.address2",
//       "users.city",
//       "users.state",
//       "users.zip_code",
//       "users.country",
//       "users.phone",
//       "users.email",
//       "users.support_pin"
//     )
//     .join("stores", "store_name", "=", "stores.store_name")
//     .join("users", "username", "=", "users.username")

//     .where("store_name", "=", store_name);
// }
