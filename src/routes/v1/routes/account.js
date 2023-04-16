var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../../utils/prisma");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_TIME = process.env.JWT_ACCESS_EXPIRATION_MINUTES;
const { checkJwt } = require("./../../../auth/check-jwt");

router
    .post("/login", async function (req, res, next) {
        const email = req.body.email;
        const password = req.body.password;

        const user = await prisma.user.findUnique({
            where: {
                email: email,
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
                const serviceToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
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
                id: req.user.userId,
            },
        });

        if (!user) {
            return res.status(400).json({ msg: "User not exists" });
        } else {
            return res.status(200).json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            });
        }
    })
    .post("/register", async function (req, res, next) {
        const { email, password, name, phone } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash the password for storage in the database
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.sendStatus(500);
            }

            // Store the user's information in the database
            const user = await prisma.User.create({
                data: {
                    email: email,
                    password: hash,
                    name: name || "",
                    phone: phone || "",
                    userGroup: {
                        connectOrCreate: {
                            where: {
                                title: "Customer",
                            },
                            create: {
                                title: "Customer",
                            },
                        },
                    },
                },
            });

            // Generate a JWT token
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });

            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            });
        });
    });

module.exports = router;
