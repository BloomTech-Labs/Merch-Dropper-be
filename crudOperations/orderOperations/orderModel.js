const axios = require("axios");

module.exports = {
  orderMaker
};

async function orderMaker(data) {
  let config = await {
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "text/plain",
      Authorization: `Basic ${process.env.TEST}` //this our TEST api key - it has to be a env variable moving forward === TEST
    }
  };
  if (data) {
    const order = await axios.post(
      "https://api.scalablepress.com/v2/order",
      data,
      config
    );
    return order.data;
  }
}
