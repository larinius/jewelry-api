var express = require("express");
var router = express.Router();

const faker = require("@faker-js/faker");
const prisma = require("./../../../utils/prisma");
const { checkJwt } = require("./../../../auth/check-jwt");
const { updateCookie } = require("./../../../auth/update-cookie");
const { checkRole } = require("./../../../auth/check-role");

router.put("/", updateCookie, checkJwt, checkRole, async function (req, res, next) {
    let data;

    data = await prisma.UserGroup.createMany({
        data: [{ title: "Customer" }, { title: "Manager" }, { title: "Admin" }],
        skipDuplicates: true,
    });

    let users;
    for (let i = 0; i < 10; i++) {
        users = await prisma.User.create({
            data: {
                email: faker.internet.email(),
                name: faker.name.fullName(),
                password: faker.internet.password(),
                phone: faker.phone.number("+48 91 ### ## ##"),
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
    }

    data = await prisma.Category.createMany({
        data: [
            { title: "Bracelets" },
            { title: "Chains" },
            { title: "Earrings" },
            { title: "Necklaces" },
            { title: "Pendants" },
            { title: "Rings" },
        ],
        skipDuplicates: true,
    });

    data = await prisma.Brand.createMany({
        data: [{ title: "Brand A" }, { title: "Brand B" }, { title: "Brand C" }],
        skipDuplicates: true,
    });

    data = await prisma.Supplier.createMany({
        data: [{ title: "Supplier A" }, { title: "SupplierB" }, { title: "Supplier C" }],
        skipDuplicates: true,
    });

    data = await prisma.OrderStatus.createMany({
        data: [{ title: "New" }, { title: "Processing" }, { title: "Completed" }, { title: "Canseled" }],
        skipDuplicates: true,
    });

    res.json(data);
});

module.exports = router;
