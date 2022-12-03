var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../../utils/prisma");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_TIME = process.env.JWT_ACCESS_EXPIRATION_MINUTES;
const { checkJwt } = require("./../../../auth/check-jwt");

router
    .post("/fingerprint", async function (req, res, next) {
        const fingerprint = req.body.fingerprint || "";

        return res.status(200).json({
            fingerprint
        });
    })


module.exports = router;
