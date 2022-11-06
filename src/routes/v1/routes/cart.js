var express = require("express");
var router = express.Router();

const prisma = require ("./../../../utils/prisma");
const { checkJwt } = require("./../../../auth/check-jwt");

router
    .get("/:id", checkJwt, async function (req, res, next) {
        const id = parseInt(req.params.id) || 0;

        const data = await prisma.cart.findUnique({
            where: {
                id: id,
            },
            include: {
                user: true,
                details: true,
            },
        });
        res.json(data);
    })
    .get("/", checkJwt, async function (req, res, next) {
        const data = await prisma.cart.findMany({
            include: {
                user: true,
                details: true,
            },
        });
        res.json(data);
    });

module.exports = router;
