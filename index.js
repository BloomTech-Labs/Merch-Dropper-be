const server = require("./server");
const dotenv = require("dotenv");
const colors = require("colors");

////setting up environmental variables////
// We need to ensure the config.env file does not get uploaded to GitHub
dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 4000;

const app = server.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.bold
  )
);

// this code is to handle any promises that are rejected but don't have a .catch() to handle the resulting error
process.on("unhandledRejection", function (reason, promise) {
  console.error("Unhandled rejection", { reason: reason, promise: promise });
});
