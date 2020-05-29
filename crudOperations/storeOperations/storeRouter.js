const router = require("express").Router();
const Stores = require("../storeOperations/storeModel");
const Models = require("../helperVariables/models");

// const restricted = require("../../globalMiddleware/restrictedMiddleware");

// @desc     Post a Store
// @route    POST /api/stores
// @access   Private

//new POST that accepts an email, store_name, and domain_name
router.post("/", async (req, res) => {
  try {
    let store = req.body;
    const email = req.body.email;

    if (!store.store_name || !store.email) {
      res.status(400).json({ message: "please include all required content" });
    } else {
      const user = await Models.Users.findByEmail(email);
      console.log(user);
      const storeWithEmail = {
        store_name: store.store_name,
        userID: user.id,
        domain_name: store.domain_name,
      };
      Models.Stores.insert(storeWithEmail);
      res.status(201).json({
        message: "You have successfully added a Store!",
        storeWithEmail,
      });
    }
  } catch (error) {
    res.status(500).json({
      [error]: error.message,
      message: "Unable to add this store, its not you.. its me",
    });
  }
});

// old POST router -- not in use
// router.post("/", async (req, res) => {
//   try {
//     let store = req.body;
//
//     if (!store.store_name || !store.userID) {
//       res.status(400).json({ message: "please include all required content" });
//     } else {
//       Models.Stores.insert(store);
//       res
//         .status(201)
//         .json({ message: "You have successfully added a Store!", store });
//     }
//   } catch (error) {
//     res.status(500).json({
//       error,
//       message: "Unable to add this store, its not you.. its me"
//     });
//   }
// });

// @desc     Get all stores
// @route    GET /api/stores
// @access   Private
router.get("/", async (req, res) => {
  try {
    const stores = await Models.Stores.find();

    if (stores) {
      res.status(200).json(stores);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Unable to get stores, its not you.. its me" });
  }
});

// @desc     Get a store by ID
// @route    GET /api/stores/:id
// @access   Private
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const store = await Models.Stores.findById(id);

    if (store) {
      res.status(200).json(store);
    } else {
      res.status(404).json({ message: "That store could not be found!" });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Unable to find this store id, its not you.. its me",
    });
  }
});

// @desc     Get a store by Name
// @route    GET /api/stores/storename/:store_name
// @access   Public
router.get("/storename/:store_name", async (req, res) => {
  const { store_name } = req.params;
  try {
    const store = await Models.Stores.findByStoreName(store_name);

    if (store) {
      res.status(200).json(store);
    } else {
      res.status(404).json({
        message:
          "Please enter a valid store name, keep in mind that store names are case sensitive",
      });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Unable to find this store, its not you.. its me",
    });
  }
});

// @desc     Get a store by userID
// @route    GET /api/stores/user/:userID
// @access   Public
router.get("/user/:userID", async (req, res) => {
  const { userID } = req.params;
  try {
    const store = await Models.Stores.findByUserID(userID);

    if (store) {
      res.status(200).json(store);
    } else {
      res.status(404).json({
        message: "Please enter a valid userID",
      });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Unable to find this store, its not you.. its me",
    });
  }
});

// @desc     Get a store by domain_name
// @route    GET /api/stores/domain/:domain_name
// @access   Public
router.get("/domain/:domain_name", async (req, res) => {
  const { domain_name } = req.params;
  try {
    const storeDomain = await Models.Stores.findByDomainName(domain_name);

    if (storeDomain) {
      res.status(200).json(storeDomain);
    } else {
      res.status(404).json({
        message:
          "Please enter a valid domain name, keep in mind that domain names are case sensitive",
      });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Unable to find this store, its not you.. its me",
    });
  }
});

// @desc     Edit a Store
// @route    PUT /api/stores/:id
// @access   Private
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const store = await Models.Stores.updateById(id, req.body);
    if (store) {
      res.status(200).json({ store, message: "Store info updated!" });
    } else {
      res.status(404).json({ message: "That store could not be found!" });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Could not edit this store, its not you.. its me",
    });
  }
});

// @desc     Delete a Store by Store name
// @route    DELETE /api/stores/storename:store_name
// @access   Private
router.delete("/:store_name", async (req, res) => {
  const { store_name } = req.params;
  try {
    const count = await Models.Stores.removeByStoreName(store_name);
    if (count > 0) {
      res.status(200).json({ message: "this Store has been deleted!" });
    } else {
      res.status(404).json({
        message:
          "Please enter a valid store name, keep in mind that store names are case sensitive",
      });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error while deleting Store, its not you.. its me",
    });
  }
});

//FUTURE RELEASE

// // @desc     Get a Stores Users
// // @route    GET /api/stores/:store_name/users
// // @access   Private
// router.get("/:store_name/users", async (req, res) => {
//   try {
//     const users = await Stores.getStoresUsers(req.params.store_name);
//     if (users) {
//       res.status(200).json(users);
//     } else {
//       res.status(404).json({ message: "Please enter a valid store name" });
//     }
//   } catch (error) {
//     res.status(500).json({
//       error,
//       message: "Unable to find this Stores Users, its not you.. its me"
//     });
//   }
// });

// Export router
module.exports = router;
