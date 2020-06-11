const db = require("../../databaseOperations/db-config");
const axios = require("axios");
module.exports = {
  ShirtMaker,
};

async function ShirtMaker(data) {
  let config = await {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${process.env.TEST}`, //this our TEST api key - it has to be a env variable moving forward === TEST
    },
  };

  if (data) {
    const mockupURL = await axios.post(
      "https://api.scalablepress.com/v3/mockup",
      data,
      config
    );
    let URL = mockupURL.data.url;
    return URL;
  }
}
