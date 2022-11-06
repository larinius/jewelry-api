/* eslint-disable security/detect-possible-timing-attacks */
var express = require("express");
var app = express();
// var jwt = require("express-jwt"); Error
// const { expressjwt: jwt } = require("express-jwt");
// var jwks = require("jwks-rsa");
const jwt = require("jsonwebtoken");

function checkJwt(req, res, next) {
    // const authHeader = req.headers["authorization"];
    const authHeader = req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];
    console.log(req.header);
    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log(err);

        if (err) return res.sendStatus(403);

        req.user = user;

        next();
    });
}

module.exports = {
    checkJwt,
};
