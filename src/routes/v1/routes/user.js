var express = require("express");
var router = express.Router();

const prisma = require ("./../../../utils/prisma");
const { checkJwt } = require("./../../../auth/check-jwt");

router
    .get("/:id", checkJwt, async function (req, res, next) {
        const id = parseInt(req.params.id) || 0;

        const data = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                wishlist: true,
                cart: true,
                prefs: true,
                userGroup: true,
                // products: { include: { product: true } },
                order: { include: { status: true } },
            },
        });
        res.json(data);
    })
    .get("/", checkJwt, async function (req, res, next) {
        const data = await prisma.user.findMany({
            include: {
                userGroup: true,
            },
        });
        res.json(data);
    });

module.exports = router;
