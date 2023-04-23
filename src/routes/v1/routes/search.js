var express = require("express");
var router = express.Router();

const prisma = require("./../../../utils/prisma");


router.get("/:id", async function (req, res, next) {
    const id = req.params.id;

    const pricePerGram = await prisma.Settings.findFirst({
        where: {
            title: "price per gram",
        },
    });

    let data = await prisma.product.findMany({
        take: 10,
        where: {
            OR: [
                {
                    sku: {
                        search: id,
                    },
                },
                {
                    code: {
                        search: id,
                    },
                },
                {
                    title: {
                        search: id,
                    },
                },
            ],
        },
        include: {
            category: true,
            image: true,
        },
    });

    data = data.map((item) => {
        item.imageCount = item.image.length;
        item.price = item.weight * pricePerGram.value.price;
        return item;
    });

    res.json(data);
});

module.exports = router;
