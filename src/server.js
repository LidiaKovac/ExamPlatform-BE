const express = require("express");
const cors = require("cors");
const endpoints = require("express-list-endpoints");
const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
  badRequest,
  routeNotFound,
} = require("./errorHandling.js");
const questionsRoute = require("./services/questions");
const db = require("./utils/db");


const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());

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
