var express = require("express");
var router = express.Router();

const qs = require("qs");
const prisma = require("./../../../utils/prisma");
const { checkJwt } = require("./../../../auth/check-jwt");
const crypto = require('crypto');

router
    .get("/:id", checkJwt, async function (req, res, next) {
        const id = parseInt(req.params.id) || 0;

        const data = await prisma.order.findUnique({
            where: {
                id: id,
            },
            include: {
                user: true,
                status: true,
                products: { include: { product: true } },
            },
        });
        res.json(data);
    })
    .get("/", checkJwt, async function (req, res, next) {
        const data = await prisma.order.findMany({
            include: {
                user: true,
                status: true,
                products: { include: { product: true } },
            },
        });
        res.json(data);
    })

    .post("/", async function (req, res, next) {
        const order = qs.parse(req.body);
        // const order = req.body;
        console.log(order);
        const userPassword = crypto.randomBytes(8).toString('hex').slice(0, 16);
        try {
            const result = await prisma.$transaction(async () => {
                let user = await prisma.user.findUnique({
                    where: {
                        email: order.user.email,
                    },
                });
                if (!user) {
                    console.log("new user", order.user);
                    // create new customer if not found
                    user = await prisma.User.create({
                        data: {
                            email: order.user.email,
                            name: order.user.name,
                            password: userPassword,
                            phone: order.user.phone,
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
                    console.log("Created:", user);
                }

                const newOrder = await prisma.order.create({
                    data: {
                        user: {
                            connect: {
                                id: user.id,
                            },
                        },
                        details: {
                            create: {
                                phone: order.user.phone,
                            },
                        },
                        products: {
                            create: {
                                product: {
                                    connect: {
                                        code: order.products[0].code,
                                    },
                                },
                                quantity: parseInt(order.products[0].quantity),
                            },
                        },
                        code: order.code,
                        total: Number(order.total),
                        weight: Number(order.weight),
                        discount: parseInt(order.discount),
                        deliveryPrice: parseInt(order.deliveryPrice),
                    },
                });

                console.log(newOrder);

                if (order.products.length > 1) {
                    console.log(`Add more products ${order.products.length} found`);
                    for (let i = 1; i < order.products.length; i++) {
                        const data = await prisma.order.update({
                            where: {
                                id: newOrder.id,
                            },
                            data: {
                                products: {
                                    create: {
                                        product: {
                                            connect: {
                                                code: order.products[i].code,
                                            },
                                        },
                                        quantity: parseInt(order.products[i].quantity),
                                    },
                                },
                            },
                        });
                    }
                }
            });
            res.sendStatus(201);
        } catch (error) {
            res.sendStatus(400);
        }
    })

    .delete("/:id", checkJwt, async function (req, res, next) {
        console.log(req.user);

        try {
            const orderId = parseInt(req.params.id) || 0;
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user.userId,
                },
            });

            if (user.userGroupId !== 3) {
                throw new Error("User not allowed to delete orders");
            }
            const result = await prisma.order.delete({
                where: {
                    id: orderId,
                },
            });
            res.sendStatus(204);
        } catch (error) {
            res.sendStatus(400);
        }
    });

module.exports = router;
