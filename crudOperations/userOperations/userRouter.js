const router = require("express").Router();
// const Users = require("./userModel");
const Models = require("../helperVariables/models");

// const restricted = require("../../globalMiddleware/restrictedMiddleware");

// @desc     Get all Users
// @route    GET /api/users
// @access   Private
router.get("/", async (req, res) => {
  try {
    const users = await Models.Users.find();
    res.status(200).json(users);
  } catch (error) {
    console.log('GET ALL USERS ERROR', error)
    res
      .status(500)
      .json({ error, message: "Unable to get users, its not you.. its me" });
  }
});

// @desc     Get a user by ID
// @route    GET /api/users/:id
// @access   Private
router.get("/:id", async (req, res) => {
  try {
    const user = await Models.Users.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "That user could not be found!" });
    }
  } catch (error) {
    console.log('GET USER BY ID ERROR', error)
    res.status(500).json({
      error,
      message: "Unable to find this user id, its not you.. its me"
    });
  }
});

// @desc     Get a user by username
// @route    GET /api/users/username/:username
// @access   Private
router.get("/username/:username", async (req, res) => {
  // console.log(req.params);
  try {
    const user = await Models.Users.findByUsername(req.params.username);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "That user could not be found!" });
    }
  } catch (error) {
    console.log('GET USERNAME ERROR', error)
    res.status(500).json({
      error,
      message: "Unable to find this user, its not you.. its me"
    });
  }
});

// @desc     Get a user by email
// @route    GET /api/users/username/:email
// @access   Private
router.get("/email/:email", async (req, res) => {
  // console.log(req.params);
  try {
    const user = await Models.Users.findByEmail(req.params.email);
    if (user) {
      res.status(200).json(user);
    } else {
      res
        .status(404)
        .json({ message: "That user could not be found by email!" });
    }
  } catch (error) {
    console.log('GET EMAIL ERROR', error)
    res.status(500).json({
      error,
      message: "Unable to find this user, its not you.. its me"
    });
  }
});

// @desc     Edit a User by username
// @route    PUT /api/users/:username
// @access   Private
router.put("/:id", async (req, res) => {
  try {
    const user = await Models.Users.findById(
      req.params.id,
      req.body
    );
    if (user) {
      res.status(200).json({ user, message: "Info updated!" });
    } else {
      res.status(404).json({ message: "That user could not be found!" });
    }
  } catch (error) {
    console.log('UPDATE USERNAME ERROR', error)
    res.status(500).json({
      error,
      message: "Could not edit this user, its not you.. its me"
    });
  }
});

// @desc     Delete a User
// @route    DELETE /api/users/:username
// @access   Private
router.delete("/:username", async (req, res) => {
  try {
    const count = await Models.Users.removeByUsername(req.params.username);
    if (count > 0) {
      res.status(200).json({ message: "this User has been deleted!" });
    } else {
      res.status(404).json({ message: "User unable to be deleted!" });
    }
  } catch (error) {
    console.log('DELETE USER ERROR', error)
    res.status(500).json({
      error,
      message: "Error while deleting User, its not you.. its me"
    });
  }
});

//future release

// // @desc     Get a users stores
// // @route    GET /api/users/:username/stores
// // @access   Private
// router.get("/:username/stores", async (req, res) => {
//   try {
//     const stores = await Users.getUsersStores(req.params.username);

//     res.status(200).json(stores);
//   } catch (error) {
//     res.status(500).json({
//       error,
//       message: "Unable to find this users stores, its not you.. its me"
//     });
//   }
// });

// Export router
module.exports = router;
