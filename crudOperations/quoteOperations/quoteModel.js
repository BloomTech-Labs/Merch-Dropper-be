const axios = require("axios");
const Models = require("../helperVariables/models");

module.exports = {
  quoteMaker
};

async function quoteMaker(data) {
  let config = await {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic bWVyY2hkcm9wcGVyMjBAZ21haWwuY29tOnRlc3RfZUIza2JJTThFRG5OdHEwenBSSU5fZw=='
      
    },
  };
  if ((data, config)) {
    console.log(data, "to SP")
    const quote = await axios.post(
      "https://api.scalablepress.com/v2/quote",
      data,
      config
    )
    .then(response => {
      console.log("response", response, response.data.issues)
      
      Models.Quotes.insert({
        total: response.data.total,
        subtotal: response.data.subtotal,
        fees: response.data.fees,
        shipping: response.data.shipping,
        tax: response.data.tax,
        orderToken: response.data.orderToken,
        warnings: response.data.warnings,
        mode: response.data.mode
      })
    })
    .catch(err => {
      console.log(err.response.data.issues)
      res.status(400) 
    })
    
    return quote;
    
  }
}
