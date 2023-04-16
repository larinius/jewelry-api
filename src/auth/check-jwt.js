const express = require("express");
const jwt = require("jsonwebtoken");
const http = require("http");

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

        if (!authHeader) {
            return res.sendStatus(StatusUnauthorized);
        }

        const [bearer, token] = authHeader.split(" ");

        if (bearer !== "Bearer") {
            return res.sendStatus(StatusUnauthorized);
        }

        try {
            const user = await jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
            req.user = user;
            next();
        } catch (err) {
            console.error("JWT verification failed: ", err);
            return res.sendStatus(StatusForbidden);
        }
    },
};
