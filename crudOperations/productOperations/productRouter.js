const router = require("express").Router();
const Products = require("./productModel");
const Models = require("../helperVariables/models");
const axios = require("axios")

// const restricted = require("../../globalMiddleware/restrictedMiddleware");

// @desc     Post a product
// @route    POST /api/Products
// @access   Private
router.post("/", async (req, res) => {
  try {
    let product = req.body;
    console.log(product, "product")
    let returnTables = [
      "id",
      "product_id",
      "color",
      "type",
      "designId",
      "productName",
      "fullSizeURL",
      "thumbnailURL",
      "description",
      "price",
      "storeID"
    ];
    if (product) {
      let addedProduct = await Models.addEntry(
        "products",
        product,
        returnTables
      );

      res.status(201).json(addedProduct);
    }
    //needs validations middleware
    // else {
    //   res.status(400).json({ message: "please include all required content" });
    // }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error,
      message: "Unable to add this product, its not you.. its me"
    });
  }
});

// @desc     Post a mockup
// @route    POST /api/products/mockup
// @access   Private
router.post("/mockup", async (req, res) => {
  try {
    let data = req.body;

    if (data) {
      const URL = await Products.ShirtMaker(data);

      if (URL) {
        res.status(201).json({
          message: "product successfully sent to ScalablePress!",
          URL
        });
      }
    } //Needs validation middleware
    // else {
    //   res.status(400).json({ message: "please include all required content" });
    // }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error posting to ScalablePress, its not you.. its me"
    });
  }
});

//@desc Get product price from scalablepress
//@route GET /api/products/price
//@access Private
router.post('/price', async (req, res) => {
  let config = await {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${process.env.TEST}`
    }
  }
  const productId = req.body.productId;
  console.log(productId)
  axios.get(`https://api.scalablepress.com/v2/products/${productId}/items`,
  config)
  .then(response => {
    res.json(response.data)
  })
  .catch(err => {
    // console.log(err, "err")
    res.json(err)
  })
})


// @desc     Get all Products
// @route    GET /api/products
// @access   Private
router.get("/", async (req, res) => {
  try {
    const products = await Models.Products.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Unable to get Products, its not you.. its me" });
  }
});

// @desc     Get an product by id
// @route    GET /api/products/:id
// @access   Private
router.get("/:id", async (req, res) => {
  const {id} = req.params
  try {
    const product = await Models.Products.findById(id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "That product could not be found!" });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Unable to find this product id, its not you.. its me"
    });
  }
});

// @desc     Get all products by storeID
// @route    GET /api/products/store/:storeID
// @access   Private
router.get("/store/:storeID", async (req, res) => {
  const {storeID} = req.params
  try {
    const product = await Models.Products.findByStoreID(storeID);
    if (product) {
      res.status(200).json(product);
    } else {
      res
        .status(404)
        .json({ message: "That store products could not be found!" });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Unable to find this store id, its not you.. its me"
    });
  }
});

// @desc     Edit a product by id
// @route    PUT /api/products/:id
// @access   Private
router.put("/:id", async (req, res) => {
  const {id} = req.params
  try {
    const product = await Models.Products.updateById(id, req.body);
    console.log(product);
    if (product) {
      res
        .status(200)
        .json({ product, message: "product info has been updated!" });
    } else {
      res.status(404).json({ message: "That product could not be found!" });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Could not edit this product, its not you.. its me"
    });
  }
});

// @desc     Delete a product by id
// @route    DELETE /api/Products/:id
// @access   Private
router.delete("/:id", async (req, res) => {
  const {id} = req.params
  try {
    const count = await Models.Products.removeById(id);
    if (count > 0) {
      res.status(200).json({ message: "this product has been deleted!" });
    } else {
      res.status(404).json({ message: "Could not find that product ID" });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error while deleting product, its not you.. its me"
    });
  }
});

// Export router
module.exports = router;
