var express = require("express");
var router = express.Router();

const prisma = require ("./../../../utils/prisma");
const { checkJwt } = require("./../../../auth/check-jwt");
const { updateCookie } = require("./../../../auth/update-cookie");
const { checkRole } = require("./../../../auth/check-role");

router
    .get("/:id", updateCookie, checkJwt, checkRole, async function (req, res, next) {
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
    .get("/", updateCookie, checkJwt, checkRole, async function (req, res, next) {
        const data = await prisma.cart.findMany({
            include: {
                user: true,
                details: true,
            },
        });
        res.json(data);
    });

module.exports = router;
