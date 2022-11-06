var express = require("express");
var router = express.Router();

const qs = require("qs");
const prisma = require ("./../../../utils/prisma");
const { checkJwt } = require("./../../../auth/check-jwt");

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
    .post("/", checkJwt, async function (req, res, next) {
        const order = qs.parse(req.body);
        try {
            const result = await prisma.$transaction(async () => {
                const newOrder = await prisma.order.create({
                    data: {
                        user: {
                            connect: {
                                id: parseInt(order.customer.id),
                            },
                        },
                        details: {
                            create: {
                                phone: order.customer.phone,
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
                        // console.log(data);
                    }
                }
            });
            res.sendStatus(201);
        } catch (error) {
            res.sendStatus(400);
        }
    });

module.exports = router;
