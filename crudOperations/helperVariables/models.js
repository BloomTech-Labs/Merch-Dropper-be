const db = require("../../databaseOperations/db-config");

class Model {
  constructor(tableName) {
    this.tableName = tableName;
  }

  insert(newItem) {
    return db(this.tableName)
      .insert(newItem)
      .then(ids => {
        const [id] = ids;
        return this.findById(id);
      });
  }

  find() {
    return db(this.tableName).select("*");
  }

  findById(id) {
    return db(this.tableName)
      .where("id", id)
      .select("*")
      .first();
  }

  findByEmail(email) {
    return db(this.tableName)
      .where("email", email)
      .select("*")
      .first();
  }

  findBySPId(spOrderID) {
    return db(this.tableName)
      .where("spOrderID", spOrderID)
      .select("*")
      .first();
  } //may need to restrict what this returns after development, perhaps in the router that uses it by destructuring res.json

  findByOrderToken(orderToken) {
    return db(this.tableName)
      .where("orderToken", orderToken)
      .select("*")
      .first();
  }

  findByUsername(username) {
    return db(this.tableName)
      .where("username", username)
      .select("*")
      .first();
  }

  //find store by userID
  findByUserID(userID) {
    return db(this.tableName)
      .where("userID", userID)
      .select("*")
      .first();
  }

  findByStoreID(storeID) {
    return db(this.tableName)
      .where("storeID", storeID)
      .select("*");
  }

  findByStoreName(store_name) {
    return db(this.tableName)
      .where("store_name", store_name)
      .select("*")
      .first();
  }

  findByDomainName(domain_name) {
    return db(this.tableName)
      .where("domain_name", domain_name)
      .select("*")
      .first();
  }
  //for finding entry associated with id passed
  // findById(tableName, id) {
  //   return db(tableName)
  //     .where("id", id)
  //     .select("*")
  //     .first();
  // }

  // ^^^^^ Refactored findBy function above to handle this as well as all other find by ids

  updateById(id, changes) {
    return db(this.tableName)
      .where("id", id)
      .update(changes)
      .then(changesMade => {
        if (changesMade > 0) {
          return this.findById(id);
        } else {
          return null;
        }
      });
  }

  updateByUsername(username, changes) {
    return db(this.tableName)
      .where("username", username)
      .update(changes)
      .then(changesMade => {
        if (changesMade > 0) {
          return this.findByUsername(username);
        } else {
          return null;
        }
      });
  }

  updateByOrderToken(orderToken, changes) {
    return db(this.tableName)
      .where("orderToken", orderToken)
      .update(changes)
      .then(changesMade => {
        if (changesMade > 0) {
          return this.findByOrderToken(orderToken);
        } else {
          return null;
        }
      });
  }

  updateBySpOrderID(spOrderID, changes) {
    return db(this.tableName)
      .where("spOrderID", spOrderID)
      .update(changes)
      .then(count => {
        if (count > 0) {
          return this.findBySPId(spOrderID);
        } else {
          return null;
        }
      });
  }

  removeById(id) {
    return db(this.tableName)
      .where("id", id)
      .del();
  }

  removeByOrderToken(orderToken) {
    return db(this.tableName)
      .where("orderToken", orderToken)
      .del();
  }

  removeByUsername(username) {
    return db(this.tableName)
      .where("username", username)
      .del();
  }

  removeByStoreName(store_name) {
    return db(this.tableName)
      .where("store_name", store_name)
      .del();
  }

  removeBySpOrderID(spOrderID) {
    return db(this.tableName)
      .where("spOrderID", spOrderID)
      .del();
  }
  
}

// this code is creating a new class object for each of the relevant tables to be exported and used in each of the router files
const Users = new Model("users");
const Stores = new Model("stores");
const Designs = new Model("designs");
const Quotes = new Model("quotes");
const Orders = new Model("orders");
const Products = new Model("newproducts");

// POST AND PUT FUNCTIONS HERE

async function addEntry(tableName, entry, returnTables) {
  const [addedItem] = await db(tableName)
    .returning(returnTables)
    .insert(entry);

  return addedItem;
}

module.exports = { Users, Stores, Designs, Quotes, Orders, Products, addEntry };
