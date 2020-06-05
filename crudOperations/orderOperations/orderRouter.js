const router = require("express").Router();
const Orders = require("../orderOperations/orderModel");
const Models = require("../helperVariables/models");

// const restricted = require("../../globalMiddleware/restrictedMiddleware");

// @desc     Post an order
// @route    POST /api/orders
// @access   Private
router.post("/", async (req, res) => {
  try {
    let data = req.body;
    if (data) {
      const spResponse = await Orders.orderMaker(data.spInfo);
      if (spResponse) {
        let order = {
          userID: data.orderInfo.userID,
          storeID: data.orderInfo.storeID,
          status: spResponse.status,
          total: spResponse.total,
          subtotal: spResponse.subtotal,
          tax: spResponse.tax,
          fees: spResponse.fees,
          shipping: spResponse.shipping,
          orderToken: spResponse.orderToken,
          spOrderID: spResponse.orderId,
          mode: spResponse.mode,
          orderedAt: spResponse.orderedAt
        };
        Models.Orders.insert(order);
        res.status(201).json({
          message:
            "You have successfully added this Quote to our DB, spResponse is from SP!",
          order,
          spResponse
        });
      }
    }
    //figure out to verify duplicate or missing data
    // else {
    //   res.status(400).json({ message: "please include all required content" });
    // }
  } catch (error) {
    console.log('ORDER POST ERROR', error)
    res.status(500).json({
      error,
      message: "Unable to add this quote, its not you.. its me"
    });
  }
});

// @desc     Get all orders
// @route    GET /api/orders
// @access   Private
router.get("/", async (req, res) => {
  try {
    const orders = await Models.Orders.find();
    res.status(200).json(orders);
  } catch (error) {
    console.log('GET ALL ORDERS', error)
    res
      .status(500)
      .json({ error, message: "Unable to get orders, its not you.. its me" });
  }
});

// @desc     Get an order by id
// @route    GET /api/orders/:id
// @access   Private
router.get("/:id", async (req, res) => {
  try {
    const order = await Models.Orders.findById(req.params.id);
    if (order) {
      res.status(200).json(order);
    } else {
      res
        .status(404)
        .json({ message: "Unable to find this order, double check the id" });
    }
  } catch (error) {
    console.log('GET ORDER BY ID', error)
    res.status(500).json({
      error,
      message: "Unable to find this order id, its not you.. its me"
    });
  }
});

// @desc     Get an order by Scalable Press orderID
// @route    GET /api/orders/sporderid/:spOrderID
// @access   Private
router.get("/sporderid/:spOrderID", async (req, res) => {
  try {
    const order = await Models.Orders.findBySPId(req.params.spOrderID);
    if (order) {
      res.status(200).json({ message: "Found it! ", order });
    } else {
      res
        .status(404)
        .json({ message: "Unable to find this order, double check the id" });
    }
  } catch (error) {
    console.log('GET SCALABLE PRESS ORDER ERROR', error)
    res.status(500).json({
      error,
      message: "Unable to find this order id, its not you.. its me"
    });
  }
});

// @desc     Get an order by Scalable Press order token
// @route    GET /api/orders/ordertoken/:orderToken
// @access   Private
router.get("/ordertoken/:orderToken", async (req, res) => {
  try {
    const order = await Models.Orders.findByOrderToken(req.params.orderToken);
    if (order) {
      res.status(200).json({ message: "Found it! ", order });
    } else {
      res
        .status(404)
        .json({ message: "Unable to find this order, double check the id" });
    }
  } catch (error) {
    console.log('GET ORDERTOKEN ERROR', error)
    res.status(500).json({
      error,
      message: "Unable to find this order id, its not you.. its me"
    });
  }
});

// @desc     Edit an order by id
// @route    PUT /api/orders/:id
// @access   Private
router.put("/:id", async (req, res) => {
  try {
    const order = await Models.Orders.updateById(req.params.id, req.body);

    if (order) {
      res.status(200).json({ order, message: "Order info has been updated!" });
    } else {
      res.status(404).json({ message: "That order could not be found!" });
    }
  } catch (error) {
    console.log('UPDATE ORDER ERROR', error)
    res.status(500).json({
      error,
      message: "Could not edit this order, its not you.. its me"
    });
  }
});

// @desc     Edit an order by order token
// @route    PUT /api/orders/ordertoken/:orderToken
// @access   Private
router.put("/ordertoken/:orderToken", async (req, res) => {
  try {
    const order = await Models.Orders.updateByOrderToken(
      req.params.orderToken,
      req.body
    );
    if (order) {
      res.status(200).json({ order, message: "Order info has been updated!" });
    } else {
      res.status(404).json({ message: "That order could not be found!" });
    }
  } catch (error) {
    console.log('UPDATE ORDERTOKEN ERROR', error)
    res.status(500).json({
      error,
      message: "Could not edit this order, its not you.. its me"
    });
  }
});

// @desc     Edit an order by Scalable press order ID
// @route    PUT /api/orders/sporderid/:spOrderID
// @access   Private
router.put("/sporderid/:spOrderID", async (req, res) => {
  try {
    const order = await Models.Orders.updateBySpOrderID(
      req.params.spOrderID,
      req.body
    );
    if (order) {
      res.status(200).json({ order, message: "Order info has been updated!" });
    } else {
      res.status(404).json({ message: "That order could not be found!" });
    }
  } catch (error) {
    console.log('UPDATE SCALABLE PRESS ORDER ERROR',error)
    res.status(500).json({
      error,
      message: "Could not edit this order, its not you.. its me"
    });
  }
});

// @desc     Delete an order by id
// @route    DELETE /api/orders/:id
// @access   Private
router.delete("/:id", async (req, res) => {
  try {
    const count = await Models.Orders.removeById(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: "this Order has been deleted!" });
    } else {
      res.status(404).json({ message: "Could not find that order ID" });
    }
  } catch (error) {
    console.log('DELETE ORDER ERROR', error)
    res.status(500).json({
      error,
      message: "Error while deleting Order, its not you.. its me"
    });
  }
});

// @desc     Delete an order by	orderToken
// @route    DELETE /api/orders/ordertoken/:orderToken
// @access   Private
router.delete("/ordertoken/:orderToken", async (req, res) => {
  try {
    const count = await Models.Orders.removeByOrderToken(req.params.orderToken);
    if (count > 0) {
      res.status(200).json({ message: "this Order has been deleted!" });
    } else {
      res.status(404).json({ message: "Could not find that order token" });
    }
  } catch (error) {
    console.log('DELETE ORDER TOKEN ERROR', error)
    res.status(500).json({
      error,
      message: "Error while deleting Order, its not you.. its me"
    });
  }
});

// @desc     Delete an order by Scalable press order ID
// @route    DELETE /api/stores/sporderid/:spOrderID
// @access   Private
router.delete("/sporderid/:spOrderID", async (req, res) => {
  try {
    const count = await Models.Orders.removeBySpOrderID(req.params.spOrderID);
    if (count > 0) {
      res.status(200).json({ message: "this Order has been deleted!" });
    } else {
      res
        .status(404)
        .json({ message: "Could not find that Scalable press order ID" });
    }
  } catch (error) {
    console.log('DELETE SCALABLE PRESS ORDER ERROR', error)
    res.status(500).json({
      error,
      message: "Error while deleting Order, its not you.. its me"
    });
  }
});

// Export router
module.exports = router;
