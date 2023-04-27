var express = require("express");
const { checkJwt } = require("../../../auth/check-jwt");
var router = express.Router();

const prisma = require("./../../../utils/prisma");

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

        if (data != undefined && Array.isArray(data)) {
            data = data.map((item) => {
                item.imageCount = item.image.length;
                item.price = (item.weight * 30.841 * 1.3).toFixed(2);
                return item;
            });
        }

        res.json(data);
    })
    .get("/", async function (req, res, next) {
        const category = req.query.category || "";
        // const sku = req.query.sku.replace("sku-", "") || "";
        const sku = req.query.sku || "";
        const limit = parseInt(req.query.limit) || 100;
        const page = parseInt(req.query.page) || 0;

        try {
            const pricePerGram = await prisma.Settings.findFirst({
                where: {
                    title: "price per gram",
                },
            });

            let categories = await prisma.Category.findMany({
                select: {
                    title: true,
                },
            });

            categories = categories.map((item) => item.title);

            const count = await prisma.product.findMany({
                distinct: ["sku"],
                where: {
                    AND: [category ? { category: { title: { equals: category } } } : {}, sku ? { sku: sku } : {}],
                },
            });

            let data = await prisma.product.findMany({
                skip: page * limit,
                take: limit,
                distinct: ["sku"],
                where: {
                    AND: [category ? { category: { title: { equals: category } } } : {}, sku ? { sku: sku } : {}],
                },
                include: {
                    category: true,
                    image: true,
                    brand: true,
                },
            });

            if (data !== null) {
                data = data.map((item) => {
                    item.imageCount = item.image.length;
                    item.price = (item.weight * 30.841).toFixed(2);
                    return item;
                });

                let meta = { count: count.length, page: page, limit: limit, categories: categories };

                if (category) {
                    meta.category = category;
                }
                data = { products: data, meta };

                res.json(data);
            } else {
                res.status(404);
            }
        } catch (error) {
            console.log(error);
        }
    });

module.exports = router;
