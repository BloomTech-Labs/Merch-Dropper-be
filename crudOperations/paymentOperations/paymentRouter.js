const router = require("express").Router();
const Models = require('../helperVariables/models');
const Orders = require('../orderOperations/orderModel');

if (process.env.NODE_ENV !== 'production') require('dotenv').config({ path: "./config/config.env" });

const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY); //Change STRIPE_SECRET_TEST_KEY to STRIPE_SECRET_KEY to collect payments when stripe goes LIVE.

router.post('/', async (req, res) => {
  
    const data = req.body;
    // console.log('data to payment intent', data)
    const amount = data.amount;
    const { domain_name } = data.token
    const { orderToken } = data.token // this will need to be the order token to send the order
    let application_fee;
    let confirmation;// to be used for client secret in confirm payment
    // let paymentMethod = {
    //   type: data.token.card.object,
    //   billing_details: {
    //     address: {
    //       city: data.token.card.address_city,
    //       country: data.token.card.address_country,
    //       line1: data.token.card.address_line1,
    //       line2: data.token.card.address_line2,
    //       postal_code: data.token.card.address_zip,
    //       state: data.token.card.address_state
    //     },
    //     email: data.email,
    //     name: data.token.card.name,
    //     phone: null // set for null unless it is passed later
    //   },
    //   metadata: {}
    // };
    let method;
    const calculateOrder = (items) => {
      // Determine application fee here
      // passing array of expenses
      // console.log('CALCULATE ORDER ITEMS', items)
      const expenses = (accumulator, current) => accumulator + current
      return application_fee = items.reduce(expenses);
    };
    // payment method operates as if billing and shipping ARE THE SAME prob will be fixed in a future release 👀

    // The helpers below grab the sellers stripe account to assign to acctStripe. The try sends the order token to scalable press and calulates the fee for Merch Dropper to cover costs
    let sellerAcct;
    // console.log(domain_name, 'DOMAIN NAME OF REQUEST')
    Models.Stores.findByDomainName(domain_name)
    .then(store => {
        // console.log('store runs', store)
        const storeID = store.id
        const { userID } = store;
        Models.Users.findById(userID)
        .then( async seller => {
          // console.log('seller runs', seller)
            const { stripe_account } = seller;
            const acctStripe = stripe_account || process.env.CONNECTED_STRIPE_ACCOUNT_ID_TEST ;
            try {
              let data = {
                "orderToken": orderToken
              }
        
              // console.log('data in the seller try', data)
              if (data) {
                const spResponse = await Orders.orderMaker(data);
                // console.log('SP RESPONSE', spResponse)
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
                    orderedAt: spResponse.orderedAt
                  };
                  let items = [
                    order.total, 
                    order.subtotal, 
                    order.tax, 
                    order.fees, 
                    order.shipping
                  ]
                  // console.log('ORDER DATA', order)
                  Models.Orders.insert(order);
                  calculateOrder(items) // run to assign all costs to application_fee
                  // Removed the res.json from here it was throwing an error
                }
              }
              //figure out to verify duplicate or missing data
              // else {
              //   res.status(400).json({ message: "please include all required content" });
              // }
            } catch (error) {
              console.log('ERROR SENDING ORDER TO SCALABLE PRESS', error)
              if(error.data){
                console.log('SP ORDER ERROR DATA', error.data)
              }
              if (error.response.data.issues){
                console.log('SP ORDER ERROR ISSUES', error.response.data.issues)
              }
              res.status(500).json({
                error,
                message: "Unable to add this order, its not you.. its me"
              });
            };

            // payment method for payment intent
            await stripe.paymentMethods.create({
              type: data.type,
              card: {token: data.token.id}
            })
            .then(function(paymentMethod){
              try {
                return method = paymentMethod;
              } catch (error) {
                console.log('PAYMENT METHOD ERROR', error);
                return res.status(500).send({
                  error: err.message
                })
              }
            });

            await stripe.paymentIntents.create({
                payment_method_types: ['card'],
                amount: amount,
                currency: 'usd', // currency is passed to obj on feature/buyer-address branch
                application_fee_amount: application_fee * 100,
                // fee will be what scalable press needs to print given product and come to us
                confirm: true,
                payment_method: method 
              }, {
                  stripeAccount: acctStripe
              }).then(function(paymentIntent) {
                try {
                  return confirmation = paymentIntent.client_secret
                  // return res.status(201).send({
                  //   publishableKey: process.env.STRIPE_PUBLISHABLE_KEY_TEST,
                  //   clientSecret: paymentIntent.client_secret
                  // });
                } catch (error) {
                  console.log('PAYMENT INTENT ERROR',error)
                  return res.status(500).send({
                    error: err.message
                  });
                }
              });

              await stripe.paymentIntents.confirm(
                confirmation,
                {payment_method: method}
              )
              .then(function(paymentIntent){
                try{
                  return res.status(201).json(paymentIntent)
                } catch(error){
                  console.log('PAYMENT INTENT CONFIRMATION ERROR', error)
                }
              })
        })
    });
});




module.exports = router;