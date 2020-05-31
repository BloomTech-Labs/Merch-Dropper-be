const router = require("express").Router();
const Models = require('../helperVariables/models');
const Orders = require('../orderOperations/orderModel');

if (process.env.NODE_ENV !== 'production') require('dotenv').config({ path: "./config/config.env" });

const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY); //Change STRIPE_SECRET_TEST_KEY to STRIPE_SECRET_KEY to collect payments when stripe goes LIVE.


router.post('/', async (req, res) => {
    const Data = {
        source: req.body.token.id,
        amount: Number(req.body.amount),
        currency: 'usd',
        receipt_email: req.body.email,
        shipping: {
            address: {
                line1: req.body.card.address_line1,
                city: req.body.card.address_city,
                country: req.body.country,
                line2: req.body.address_line2,
                postal_code: req.body.address_zip,
                state: req.body.address_state
            },
            name: req.body.card.name
        }
    };
    const paymentIntent = await stripe.paymentIntents.create({
     amount: Data.amount,
     currency: Data.currency,
     payment_method_types: ['card'],
     application_fee_amount: 1 * 100  // placeholder value 
    }, {
        stripeAccount: `{{${CONNECTED_STRIPE_ACCOUNT_ID_TEST}}}`
    })
    // stripe.charges.create(Data, (stripeErr, stripeRes) => {
    //     if (stripeErr) {
    //         res.status(500).json({ error: stripeErr });
    //         console.log('Stripe Error',stripeErr)
    //     } else {
    //         res.status(200).json({ success: stripeRes })
    //     }
    // })

})

router.post('/create-payment-intent', async (req, res) => {
    const data = req.body;
    const amount = data.amount;
    const { domain_name } = data.token
    const { spInfo } = data.token // this will need to be the order token to send the order
    
   
    // The helpers below grab the sellers stripe account to assign to acctStripe
    let sellerAcct;
    Models.Stores.findByDomainName(domain_name)
    .then(store => {
        const { userID } = store;
        Models.Users.findById(userID)
        .then( async seller => {
            const { stripe_account } = seller;
            const acctStripe = stripe_account || process.env.CONNECTED_STRIPE_ACCOUNT_ID_TEST ;
            let application_fee = 0;
            try {
              let data = spInfo;
              console.log('data in the seller try', data)
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
                  let items = [
                    order.total, 
                    order.subtotal, 
                    order.tax, 
                    order.fees, 
                    order.shipping
                  ]
                  Models.Orders.insert(order);
                  res.status(201).json({
                    message:
                      "You have successfully added this Order to our DB, spResponse is from SP!",
                    order,
                    spResponse
                  });
                  calculateOrder(items) // run to assign all costs to application_fee
                }
              }
              //figure out to verify duplicate or missing data
              // else {
              //   res.status(400).json({ message: "please include all required content" });
              // }
            } catch (error) {
              res.status(500).json({
                error,
                message: "Unable to add this order, its not you.. its me"
              });
            }
            const calculateOrder = (items) => {
              // Determine application fee here
              // passing array of expenses
              const expenses = (accumulator, current) => accumulator + current
              let application_fee = items.reduce(expenses);
              return application_fee;
            };

            // const appFee = await calculateOrder(); // hopefully
            // console.log('the application fee details', appFee)

            await stripe.paymentIntents.create({
                payment_method_types: ['card'],
                amount: amount,
                currency: 'usd', // currency is passed to obj on feature/buyer-address branch
                application_fee_amount: application_fee, // fee will be what scalable press needs to print given product and come to us
              }, {
                  stripeAccount: acctStripe
              }).then(function(paymentIntent) {
                try {
                  return res.send({
                    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY_TEST,
                    clientSecret: paymentIntent.client_secret
                  });
                } catch (err) {
                  return res.status(500).send({
                    error: err.message
                  });
                }
              }); 
        })
    });
});




module.exports = router;