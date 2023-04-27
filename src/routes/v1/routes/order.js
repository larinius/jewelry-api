var express = require("express");
var router = express.Router();

const qs = require("qs");
const prisma = require("./../../../utils/prisma");
const crypto = require("crypto");

const { checkJwt } = require("./../../../auth/check-jwt");
const { updateCookie } = require("./../../../auth/update-cookie");
const { checkRole } = require("./../../../auth/check-role");

router
    .get("/my", updateCookie, checkJwt, async function (req, res, next) {
        console.log("MY ORDERS");
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user.userId,
                },
            });

            // customer orders
            const data = await prisma.order.findMany({
                where: {
                    userId: user.id,
                },
                include: {
                    user: true,
                    status: true,
                    products: { include: { product: true } },
                },
            });
            res.json(data);
        } catch (error) {
            res.status(401).json({ message: "Error getting orders" });
        }
    })

    .get("/:id", updateCookie, checkJwt, checkRole, async function (req, res, next) {
        const id = parseInt(req.params.id) || 0;

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user.userId,
                },
            });

            if (user.userGroupId === 3) {
                // admin order by id
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
            } else {
                // customer orders
                const data = await prisma.order.findMany({
                    where: {
                        id: id,
                        userId: user.id,
                    },
                    include: {
                        user: true,
                        status: true,
                        products: { include: { product: true } },
                    },
                });
                if (data.length === 0) {
                    return res.status(404).json({ message: "Order not found" });
                }
                res.json(data[0]);
            }
        } catch (error) {
            res.status(401).json({ message: "Error getting orders" });
        }
    })

    .get("/", updateCookie, checkJwt, checkRole, async function (req, res, next) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user.userId,
                },
            });

            if (user.userGroupId === 3) {
                // admin orders
                const data = await prisma.order.findMany({
                    include: {
                        user: true,
                        status: true,
                        products: { include: { product: true } },
                    },
                });
                res.json(data);
            } else {
                // customer orders
                const data = await prisma.order.findMany({
                    where: {
                        userId: user.id,
                    },
                    include: {
                        user: true,
                        status: true,
                        products: { include: { product: true } },
                    },
                });
                res.json(data);
            }
        } catch (error) {
            res.status(401).json({ message: "Error getting orders" });
        }
    })

    .post("/", async function (req, res, next) {
        const order = qs.parse(req.body);
        // const order = req.body;
        console.log(order);
        const userPassword = crypto.randomBytes(8).toString("hex").slice(0, 16);
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

    .delete("/:id", updateCookie, checkJwt, checkRole, async function (req, res, next) {
        console.log(req.user);

        try {
            const orderId = parseInt(req.params.id) || 0;

            const result = await prisma.order.delete({
                where: {
                    id: orderId,
                },
            });
            res.sendStatus(204);
        } catch (error) {
            res.sendStatus(400);
        }
    })

    .delete('/:id/cancel', checkJwt, async (req, res) => {
      const { id } = req.params;

      try {

        const user = await prisma.user.findUnique({
          where: {
              id: req.user.userId,
          },
        });

        // Get the order from the database
        const order = await Order.findById(id);

        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }

        if (order.userId !== user.id) {
          return res.status(400).json({ message: 'Access denied' });
        }

        // Check if the order is already cancelled
        if (order.status === 4) {
          return res.status(400).json({ message: 'Order is already cancelled' });
        }

        // Update the order status to cancelled
        order.status = 4;
        await order.save();

        return res.status(200).json({ message: 'Order cancelled successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });

module.exports = router;
