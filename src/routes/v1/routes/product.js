var express = require("express");
var router = express.Router();

const prisma = require ("./../../../utils/prisma");

router
    .get("/:id", async function (req, res, next) {
        const id = parseInt(req.params.id) || 0;

        const data = await prisma.product.findUnique({
            where: {
                id: id,
            },
            include: {
                category: true,
                image: true,
            },
        });

        res.json(data);
    })
    .get("/", async function (req, res, next) {
        const pricePerGram = await prisma.Settings.findFirst({
            where: {
                title: "price per gram",
            },
        });

        let data = await prisma.product.findMany({
            include: {
                category: true,
                image: true,
            },
        });

        data = data.map((item) => {
            item.imageCount = item.image.length;
            item.price = (item.weight * 30.841).toFixed(2);
            return item;
        });

        res.json(data);
    });

module.exports = router;
