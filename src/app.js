const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const httpStatus = require("http-status");

const config = require("./config/config");
const morgan = require("./config/morgan");
const routes = require("./routes/v1");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const fileUpload = require("express-fileupload");

const { clientOrigins } = require("./auth/env.dev");

var { unless } = require("express-unless");

const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const accountRoute = require("./routes/v1/routes/account");

const app = express();

if (config.env !== "test") {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(fileUpload());
    app.use(bodyParser.urlencoded({ extended: true }));
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors({
  origin: clientOrigins,
  credentials: true,
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// auth
app.use("/api/v1/account", accountRoute);

app.use("/api/v1", routes);

// app.use(checkJwt.unless({ path: ['/account/login']}));

// v1 api routes
// app.use("/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
