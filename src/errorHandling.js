const badRequest = (err, req, res, next) => {
    if (err.httpStatusCode === 400) {
      res.status(400).send(err, "Bad Request! Check your 'req.body'.")
    }
    next(err)
  }

const notFoundHandler = (err, req, res, next) => {
    if (err.httpStatusCode === 404) {
      res.status(404).send("ERR 404 Not found!")
    }
    next(err)
  }
  
  const unauthorizedHandler = (err, req, res, next) => {
    if (err.httpStatusCode === 401) {
      res.status(401).send("ERR 401 Unauthorized!")
    }
    next(err)
  }
  
  const forbiddenHandler = (err, req, res, next) => {
    if (err.httpStatusCode === 403) {
      res.status(403).send("ERR 403 Forbidden!")
    }
    next(err)
  }
  
  const catchAllHandler = (err, req, res, next) => {
    if (err.httpStatusCode === 500) {
      res.status(err.httpStatusCode || 500).send(err)
    }
    next(err)
  }

  const routeNotFound = (err, req, res, next) => {
    if (!req.route) {
      res.status(err.httpStatusCode || 404).send("This route does not exists yet")
    }
  }
  
  
  module.exports = {
    notFoundHandler,
    unauthorizedHandler,
    forbiddenHandler,
    catchAllHandler,
    badRequest,
    routeNotFound,
  }