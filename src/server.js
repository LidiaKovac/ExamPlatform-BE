const express = require("express");
const cors = require("cors");
const { join } = require("path");
const endpoints = require("express-list-endpoints");

const questionsRoute = require("./services/questions");

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());

const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
  badRequest,
  routeNotFound,
} = require("./errorHandling.js");
const db = require("./utils/db");

server.use("/exam", questionsRoute);

db.sequelize.sync({ force: false }).then((result) => {
  server.listen(port, () => {
    console.log(
      "❗ Server is running on",
      port,
      " with these endpoints: ",
      endpoints(server)
    );
  });
});
