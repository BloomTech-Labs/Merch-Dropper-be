const router = require("express").Router();
const Designs = require("../designOperations/designsModel");
const Models = require("../helperVariables/models");
// const restricted = require("../../globalMiddleware/restrictedMiddleware");

// @desc     Post a Design
// @route    POST /api/designs
// @access   Private
router.post("/", async (req, res) => {
  try {
    let design = req.body;
    console.log('the design body', design)
    let returnTables = [
      "id",
      "design_name",
      "thumbnail_url",
      "design_url",
      "storeID",
      "userID"
    ];
    if (design) {
      await Models.addEntry("designs", design, returnTables);
      res.status(201).json({ message: "Design Added!", design });
    } else {
      res.status(400).json({ message: "please include all required content" });
    }
  } catch (error) {
    console.log('design error', error)
    res.status(500).json({
      error,
      message: "Unable to add this design, its not you.. its me"
    });
  }
});

// @desc     Get all designs
// @route    GET /api/designs
// @access   Private
router.get("/", async (req, res) => {
  try {
    const designs = await Models.Designs.find();
    res.status(200).json(designs);
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Unable to get designs, its not you.. its me" });
  }
});

// @desc     Get an design by designID
// @route    GET /api/designs/:designID
// @access   Private
router.get("/:designID", async (req, res) => {
  try {
    const design = await Models.Designs.findById(req.params.designID);

    if (design) {
      res.status(200).json(design);
    } else {
      res
        .status(404)
        .json({ message: "Unable to find this design, double check the id" });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Unable to find this design id, its not you, its me..."
    });
  }
});

// @desc     Edit a design by designID
// @route    PUT /api/designs/:designID
// @access   Private
router.put("/:designID", async (req, res) => {
  try {
    const design = await Models.Designs.updateById(
      req.params.designID,
      req.body
    );
    if (design) {
      res
        .status(200)
        .json({ message: "Design info has been updated!", design });
    } else {
      res.status(404).json({ message: "That design could not be found!" });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Could not edit this design, its not you.. its me"
    });
  }
});

// @desc     Delete a design by designID
// @route    DELETE /api/designs/:designID
// @access   Private
router.delete("/:designID", async (req, res) => {
  try {
    const count = await Models.Designs.removeById(req.params.designID);
    if (count > 0) {
      res.status(200).json({ message: "this Design has been deleted!" });
    } else {
      res.status(404).json({ message: "Could not find that design ID" });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error while deleting Design, its not you.. its me"
    });
  }
});

// Export router
module.exports = router;
