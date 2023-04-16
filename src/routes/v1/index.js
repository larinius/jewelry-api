const express = require("express");
const docsRoute = require("./docs.route");
const config = require("../../config/config");

const brandRoute = require("./routes/brand");
const cartRoute = require("./routes/cart");
const categoryRoute = require("./routes/category");
const dummyRoute = require("./routes/dummy");
const migrateRoute = require("./routes/migrate");
const orderRoute = require("./routes/order");
const orderstatusRoute = require("./routes/orderstatus");
const ordercodeRoute = require("./routes/ordercode");
const priceuploadRoute = require("./routes/priceupload");
const productRoute = require("./routes/product");
const searchRoute = require("./routes/search");
const userRoute = require("./routes/user");
const userGroupRoute = require("./routes/usergroup");
const sessionRoute = require("./routes/session");

const router = express.Router();

const defaultRoutes = [
    {
        path: "/session",
        route: sessionRoute,
    },
    {
        path: "/brand",
        route: brandRoute,
    },
    {
        path: "/cart",
        route: cartRoute,
    },
    {
        path: "/category",
        route: categoryRoute,
    },
    {
        path: "/order",
        route: orderRoute,
    },
    {
        path: "/orderstatus",
        route: orderstatusRoute,
    },
    {
      path: "/ordercode",
      route: ordercodeRoute,
  },
    {
        path: "/priceupload",
        route: priceuploadRoute,
    },
    {
        path: "/product",
        route: productRoute,
    },
    {
        path: "/search",
        route: searchRoute,
    },
    {
        path: "/user",
        route: userRoute,
    },
    {
        path: "/usergroup",
        route: userGroupRoute,
    },
];

const devRoutes = [
    // routes available only in development mode
    {
        path: "/docs",
        route: docsRoute,
    },
    {
        path: "/dummy",
        route: dummyRoute,
    },
    {
        path: "/migrate",
        route: migrateRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route);
    });
}

module.exports = router;
