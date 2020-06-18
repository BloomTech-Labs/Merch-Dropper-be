const router = require("express").Router();
const Models = require("../helperVariables/models");

if (process.env.NODE_ENV !== "production")
  require("dotenv").config({ path: "./config/config.env" });

const stripe = require("stripe")("sk_test_RRgLrJ77g7l5APlwZ9Tkna6g00NLWWukJR");

router.post("/accounts", async (req, res) => {
  /* const userCode = req.body.user_code;
    const email = req.body.email;

    const response = await stripe.oauth.token({
        grant_type: 'authorization_code',
        code: userCode,
        });

    let user = await Models.Users.findByEmail(email)
    user.stripe_account = response.stripe_user_id;
    console.log(user)
    
    const updatedUser = await Models.Users.updateByUsername(user.username, user);
    console.log(updatedUser)
    
    if(response){
        res.status(201).json({ message: "Account Number Aqcuired!", response });
    }
    else{
        res.status(500).json({ error: "There was an issue connecting your stripe account", response})
    }*/

  const userCode = req.body.user_code;
  const email = req.body.email;
  try {
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code: userCode,
    });
    let user = await Models.Users.findByEmail(email);
    user.stripe_account = response.stripe_user_id;
    console.log(user);

    const updatedUser = await Models.Users.updateByUsername(
      user.username,
      user
    );
    console.log(updatedUser);
    res.status(201).json({ message: "Account Number Aqcuired!", response });
  } catch (err) {
    res
      .status(500)
      .json({
        error: "There was an issue connecting your stripe account",
        response,
      });
  }
});

router.get("/accounts", async (req, res) => {
  try {
    const user = await Models.Users.find();
    console.log(user);
    if (user) {
      res.status(201).json({ user });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Unable to retrieve stripe info",
    });
  }
});

router.get("/:email", async (req, res) => {
  const { email } = req.params;

  console.log(email);
  try {
    const user = await Models.Users.findByEmail(email);
    console.log(user);
    if (user) {
      res.status(201).json({ user });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Unable to retrieve stripe info",
    });
  }
});

module.exports = router;
