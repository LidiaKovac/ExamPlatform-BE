const express = require("express")
const cors = require("cors")
const { join } = require("path")
const endpoints = require("express-list-endpoints")

const questionsRoute = require("./services/questions")

const server = express()
const port = process.env.PORT

server.use(cors())
server.use(express.json())

const {
    notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
  badRequest,
  routeNotFound,
 
} = require("./errorHandling.js")

server.use('/exam', questionsRoute)

server.listen(port, ()=> {
    console.log("Server is running on", port, " with these endpoints: ", endpoints(server))
})