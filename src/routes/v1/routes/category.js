var express = require("express");
var router = express.Router();

const prisma = require ("./../../../utils/prisma");

router
    .get("/:id", async function (req, res, next) {
        const id = parseInt(req.params.id) || 0;

        const data = await prisma.category.findUnique({
            where: {
                id: id,
            },
        });
        res.json(data);
    })
    .get("/", async function (req, res, next) {
        const data = await prisma.category.findMany();
        res.json(data);
    });

module.exports = router;
