const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");

//////    import Router files    //////
const authRouter = require("./authOperations/authRouter");
const userRouter = require("./crudOperations/userOperations/userRouter");
const storeRouter = require("./crudOperations/storeOperations/storeRouter");
const orderRouter = require("./crudOperations/orderOperations/orderRouter");
const quoteRouter = require("./crudOperations/quoteOperations/quoteRouter");
const designsRouter = require("./crudOperations/designOperations/designsRouter");
const productRouter = require("./crudOperations/productOperations/productRouter");
const paymentRouter = require("./crudOperations/paymentOperations/paymentRouter");
const stripeAccountRouter = require("./crudOperations/paymentOperations/accountRouter");

const server = express();

server.use(helmet());

server.use(express.json());

// morgan(format, options) - The format function will be called with three arguments tokens, req, and res, where tokens is an object with all defined tokens, req is the HTTP request and res is the HTTP response. The function is expected to return a string that will be the log line, or undefined / null to skip logging.
// source: https://github.com/expressjs/morgan
server.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);

server.use(cors());
//  pass this in cors if having bad cors issues

/*const corsSettings = {
   origin: true,
   credentials: true
 }

 server.use(cors(corsSettings));*/

/*server.use(cors({ credentials: true, origin: `http://localhost:3000/`}));
server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
 });*/

//server.use((req, res, next) => {    res.header('Access-Control-Allow-Origin', '*');    next();   });

//////    Use routers    ///////
server.use("/api/auth", authRouter);
server.use("/api/users", userRouter);
server.use("/api/stores", storeRouter);
server.use("/api/orders", orderRouter);
server.use("/api/quotes", quoteRouter);
server.use("/api/designs", designsRouter);
server.use("/api/products", productRouter);
server.use("/api/payments", paymentRouter);
server.use("/api/stripe", stripeAccountRouter);

//testing that the server works
server.get("/", (req, res) => {
  res.status(200).json({ status: "The Merch Dropper server is running!!" });
});

module.exports = server;
