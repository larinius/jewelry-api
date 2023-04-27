const express = require("express");
const jwt = require("jsonwebtoken");
const http = require("http");
const { verify } = require('jsonwebtoken');

const StatusUnauthorized = 401;
const StatusForbidden = 403;

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("JWT_SECRET environment variable not set.");
    process.exit(1);
}

module.exports = {
    checkJwt: async (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader && !req.cookies.serviceToken) {
            console.log("No auth header or cookie");
            return res.sendStatus(StatusUnauthorized);
        }

        let token;
        if (authHeader) {
            const [bearer, authToken] = authHeader.split(' ');
            if (bearer === 'Bearer') {
                token = authToken;
            } else {
                return res.sendStatus(StatusUnauthorized);
            }
        } else {
            token = req.cookies.serviceToken;
        }

        try {
            const decoded = await verify(token, JWT_SECRET, { algorithms: ["HS256"] });
            req.user = decoded;
            next();
        } catch (err) {
            console.error("JWT verification failed: ", err);
            return res.sendStatus(StatusForbidden);
        }
    },
};
