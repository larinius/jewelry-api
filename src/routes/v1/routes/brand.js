var express = require("express");
var router = express.Router();
const { checkJwt } = require("./../../../auth/check-jwt");
const prisma = require("./../../../utils/prisma");

router
    .get("/:id", checkJwt, async function (req, res, next) {
        const id = parseInt(req.params.id) || 0;

        const data = await prisma.brand.findUnique({
            where: {
                id: id,
            },
        });
        res.json(data);
    })
    .get("/", checkJwt, async function (req, res, next) {
        const data = await prisma.brand.findMany();
        res.json(data);
    });

module.exports = router;
