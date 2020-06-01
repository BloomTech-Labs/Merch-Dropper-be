const router = require("express").Router();
const Quotes = require("../quoteOperations/quoteModel");
const Models = require("../helperVariables/models");
// const orderHelper = require("../helperVariables/orderHelpers");
// const restricted = require("../../globalMiddleware/restrictedMiddleware");

// @desc     Post a Quote
// @route    POST /api/quotes
// @access   Private
router.post("/", async (req, res) => {
  console.log('made it')
  try {
    let data = req.body;
    console.log('quote data', data)
    if (data) {
      console.log(data, "data")
      const spResponse = await Quotes.quoteMaker(data.spInfo);
      if (spResponse) {
        let quote = {
          userID: data.quoteInfo.userID, // not relevant until/if there are buyer users
          storeID: data.quoteInfo.storeID,
          total: spResponse.total,
          subtotal: spResponse.subtotal,
          tax: spResponse.tax,
          fees: spResponse.fees,
          shipping: spResponse.shipping,
          orderToken: spResponse.orderToken,
          warnings: spResponse.warnings,
          mode: spResponse.mode
        };
        Models.Quotes.insert(quote);
        res.status(201).json({
          message:
            "You have successfully added this Quote to our DB, spResponse is from SP!",
          quote,
          spResponse
        });
      }
    // } //figure out how to test wrong or missing info here, its tricky with the api call
    // else {
    //   res.status(400).json({ message: "please include all required content" });
    }
  }catch (error) {
    res.status(500).json({
      error
    });
  }
});

// @desc     Get all quotes
// @route    GET /api/quotes
// @access   Private
router.get("/", async (req, res) => {
  try {
    const quotes = await Models.Quotes.find();
    // console.log(quotes);
    res.status(200).json(quotes);
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Unable to get quotes, its not you.. its me" });
  }
});

// @desc     Get an quote by id
// @route    GET /api/quotes/:id
// @access   Private
router.get("/:id", async (req, res) => {
  try {
    const quote = await Models.Quotes.findById(req.params.id);
    if (quote) {
      res.status(200).json(quote);
    } else {
      res
        .status(404)
        .json({ message: "Unable to find this quote, double check the id" });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Unable to find this quote id, its not you.. its me"
    });
  }
});

// @desc     Get a quote by Scalable Press order token
// @route    GET /api/quotes/:orderToken
// @access   Private
router.get("/quotetoken/:orderToken", async (req, res) => {
  try {
    const quote = await Models.Quotes.findByOrderToken(req.params.orderToken);

    if (quote) {
      res.status(200).json(quote);
    } else {
      res.status(404).json({
        message:
          "Please enter a valid quote token, keep in mind they are case sensitive"
      });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Unable to find this order id, its not you.. its me"
    });
  }
});

// @desc     Edit a quote by id
// @route    PUT /api/quotes/:id
// @access   Private
router.put("/:id", async (req, res) => {
  try {
    const quote = await Models.Quotes.updateById(req.params.id, req.body);
    if (quote) {
      res.status(200).json({ quote, message: "Quote info has been updated!" });
    } else {
      res.status(404).json({ message: "That quote could not be found!" });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Could not edit this quote, its not you.. its me"
    });
  }
});

// @desc     Edit an quote by order token
// @route    PUT /api/quotes/ordertokenedit/:orderToken
// @access   Private
router.put("/ordertokenedit/:orderToken", async (req, res) => {
  try {
    // console.log(req.params.orderToken);
    const quote = await Models.Quotes.updateByOrderToken(
      req.params.orderToken,
      req.body
    );
    // console.log(quote);
    if (quote) {
      res.status(200).json({ message: "Quote info has been updated!", quote });
    } else {
      res.status(404).json({ message: "That quote could not be found!" });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Could not edit this quote, its not you.. its me"
    });
  }
});

// @desc     Delete a quote by id
// @route    DELETE /api/quotes/:id
// @access   Private
router.delete("/:id", async (req, res) => {
  try {
    const count = await Models.Quotes.removeById(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: "this Quote has been deleted!" });
    } else {
      res.status(404).json({ message: "Could not find that quote ID" });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error while deleting Quote, its not you.. its me"
    });
  }
});

// @desc     Delete a quote by order token
// @route    DELETE /api/quotes/:orderToken
// @access   Private
router.delete("/ordertoken/:orderToken", async (req, res) => {
  try {
    const count = await Models.Quotes.removeByOrderToken(req.params.orderToken);
    if (count > 0) {
      res.status(200).json({ message: "this Quote has been deleted!" });
    } else {
      res
        .status(404)
        .json({ message: "Could not find that quote by given quote token" });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error while deleting Quote, its not you.. its me"
    });
  }
});

// Export router
module.exports = router;
