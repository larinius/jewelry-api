/* eslint-disable security/detect-possible-timing-attacks */
var express = require("express");
var app = express();
// var jwt = require("express-jwt"); Error
// const { expressjwt: jwt } = require("express-jwt");
// var jwks = require("jwks-rsa");
const jwt = require("jsonwebtoken");

module.exports = {
    checkJwt: (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(" ")[1];

            jwt.verify(token, accessTokenSecret, (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }

                req.user = user;
                next();
            });
        } else {
            res.sendStatus(401);
        }
    },
};
