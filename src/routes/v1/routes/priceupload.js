var express = require("express");
var router = express.Router();

const readXlsxFile = require("read-excel-file/node");
const prisma = require("./../../../utils/prisma");
const fs = require("fs");

router.post("/", (req, res) => {
    // Log the files to the console

    const file = req.files.file;

    if (!file) return res.sendStatus(400);

    const filePath = __dirname + "/upload/" + file.name;

    // const filePath = path.join(__dirname + "upload" + file.name);

    file.mv(filePath);
    // All good

    const schema = {
        code: {
            prop: "code",
            type: String,
        },
        sku: {
            prop: "sku",
            type: String,
        },
        category: {
            prop: "category",
            type: String,
        },
        caratage: {
            prop: "caratage",
            type: String,
        },
        weight: {
            prop: "weight",
            type: Number,
        },
        price: {
            prop: "price",
            type: Number,
        },
        title: {
            prop: "title",
            type: String,
        },
        image: {
            prop: "image",
            type: String,
        },
    };

    readXlsxFile(filePath, { schema }).then(async (rows) => {
        // `rows` is an array of rows
        // each row being an array of cells.

        rows.rows.forEach(async (row) => {
            try {
                let prodCount = await prisma.Product.count({
                    where: {
                        code: row.code,
                    },
                });

                if (prodCount === 0) {
                    let data = await prisma.Product.create({
                        data: {
                            sku: row.sku,
                            title: row.title,
                            code: row.code,
                            weight: row.weight,
                            caratage: row.caratage,
                            category: {
                                connect: {
                                    title: row.category,
                                },
                            },
                            image: {
                                create: {
                                    alt: row.title,
                                    title: row.title,
                                    path: row.image,
                                },
                            },
                        },
                    });
                } else {
                    let category = await prisma.Category.findUnique({
                        where: {
                            title: row.category,
                        },
                    });

                    // let image = await prisma.Image.findUnique({
                    //     where: {
                    //         path: row.image,
                    //     },
                    // });

                    let data = await prisma.Product.update({
                        where: {
                            code: row.code,
                        },
                        data: {
                            sku: row.sku,
                            title: row.title,
                            weight: row.weight,
                            caratage: row.caratage,
                            price: row.price,
                            category: {
                                connect: { id: category.id },
                            },
                            image: {
                                create: {
                                    alt: row.title,
                                    title: row.title,
                                    path: row.image,
                                },
                            },
                        },
                    });
                }
            } catch (error) {
                // console.error(error);
            }

            // console.log(data);
        });
    });

    res.sendStatus(200);
});

module.exports = router;
