var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../../utils/prisma");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_TIME = process.env.JWT_ACCESS_EXPIRATION_MINUTES;

router
    .post("/login", async function (req, res, next) {
        const email = req.body.email;
        const password = req.body.password;

        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });

        if (!user) {
            return res.status(400).json({ msg: "User not exist" });
        }

        bcrypt.compare(password, user.password, (err, data) => {
            //if error than throw error
            if (err) throw err;

            //if both match than you can do anything
            if (data) {
                const serviceToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: 60 * 60 * 24 });
                return res.status(200).json({
                    serviceToken,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    },
                });
            } else {
                return res.status(401).json({ msg: "Invalid credencial" });
            }
        });
    })
    .get("/me", checkJwt, async function (req, res, next) {

        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });

        if (!user) {
            return res.status(400).json({ msg: "User not exist" });
        } else {
            return res.status(200).json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            });
        }
    });

module.exports = router;
