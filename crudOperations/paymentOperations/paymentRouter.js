const router = require("express").Router();
const Models = require("../helperVariables/models");
const Orders = require("../orderOperations/orderModel");

if (process.env.NODE_ENV !== "production")
  require("dotenv").config({ path: "./config/config.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY); //Change STRIPE_SECRET_TEST_KEY to STRIPE_SECRET_KEY to collect payments when stripe goes LIVE.

router.post("/", async (req, res) => {
  const data = req.body;
  const amount = data.amount;
  const { domain_name } = data.token;
  const { orderToken } = data.token; // order token for scalable press
  let application_fee;
  let confirmation; // to be used for client secret in confirm payment
  let method; // initialized if needed for payment method object
  // stripe token object reverted for "source" in create charge
  const stripeToken = data.token;
  delete stripeToken.domain_name;
  delete stripeToken.orderToken;

  const calculateOrder = (items) => {
    // Determine application fee here
    const expenses = (accumulator, current) => accumulator + current;
    return (application_fee = items.reduce(expenses));
  };

  let sellerAcct;
  // find the store
  Models.Stores.findByDomainName(domain_name).then((store) => {
    const storeID = store.id;
    const { userID } = store;
    // find the user
    Models.Users.findById(userID).then(async (seller) => {
      const { stripe_account } = seller;
      const acctStripe =
        stripe_account || process.env.CONNECTED_STRIPE_ACCOUNT_ID_TEST;
      try {
        // has to be a json object
        let data = {
          orderToken: orderToken,
        };
        if (data) {
          // send order token to SP
          const spResponse = await Orders.orderMaker(data);
          if (spResponse) {
            let order = {
              userID: seller.id,
              storeID: storeID,
              status: spResponse.status,
              total: spResponse.total,
              subtotal: spResponse.subtotal,
              tax: spResponse.tax,
              fees: spResponse.fees,
              shipping: spResponse.shipping,
              orderToken: spResponse.orderToken,
              spOrderID: spResponse.orderId,
              mode: spResponse.mode,
              orderedAt: spResponse.orderedAt,
            };
            let items = [
              order.total,
              order.subtotal,
              order.tax,
              order.fees,
              order.shipping,
            ];
            Models.Orders.insert(order);
            calculateOrder(items); // run to assign all costs to application_fee
            // Removed the res.json from here it was throwing an error
          }
        }
        //figure out to verify duplicate or missing data
        // else {
        //   res.status(400).json({ message: "please include all required content" });
        // }
      } catch (error) {
        console.log("ERROR SENDING ORDER TO SCALABLE PRESS", error);
        if (error.data) {
          console.log("SP ORDER ERROR DATA", error.data);
        }
        if (error.response.data.issues) {
          console.log("SP ORDER ERROR ISSUES", error.response.data.issues);
        }
        res.status(500).json({
          error,
          message: "Unable to add this order, its not you.. its me",
        });
      }

      // create a payment intent
      await stripe.paymentIntents
        .create(
          {
            payment_method_types: ["card"],
            amount: amount,
            currency: "usd", // US based so hard coded
            application_fee_amount: application_fee * 100,
            // confirm: true,
            // payment_method: method
          },
          {
            stripeAccount: acctStripe, // stripe-account header
          }
        )
        .then(function (paymentIntent) {
          try {
            return (confirmation = paymentIntent.client_secret);
          } catch (error) {
            console.log("PAYMENT INTENT ERROR", error);
            return res.status(500).send({
              error: err.message,
            });
          }
        });

      // create a charge ENDGAME DO NOT TOUCH UNLESS ABSOLUTELY CERTAIN
      await stripe.charges
        .create(
          {
            amount: amount,
            currency: "usd", // US based so hardcoded
            source: data.token.id,
            receipt_email: data.token.email,
            application_fee_amount: application_fee * 100,
          },
          {
            stripeAccount: acctStripe, // Stripe-Account header
          }
        )
        .then(function (charge) {
          try {
            return res.status(201).json(charge);
          } catch (error) {
            console.log("CREATED CHARGE ERROR", error);
            return res.status(500).send({
              error: err.message,
            });
          }
        });
    });
  });
});

module.exports = router;
