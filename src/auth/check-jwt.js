var express = require("express");
var app = express();
// var jwt = require("express-jwt"); Error
const { expressjwt: jwt } = require("express-jwt");
var jwks = require("jwks-rsa");

const checkJwt = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://dev-n023tzazgiffxens.eu.auth0.com/.well-known/jwks.json",
    }),
    audience: "https://dashboard.dimenshteyn.co.il/",
    issuer: "https://dev-n023tzazgiffxens.eu.auth0.com/",
    algorithms: ["RS256"],
});

module.exports = {
    checkJwt,
};
