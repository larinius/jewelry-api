var express = require("express");
var router = express.Router();

const prisma = require("./../../../utils/prisma");
const { checkJwt } = require("./../../../auth/check-jwt");
const { updateCookie } = require("./../../../auth/update-cookie");
const { checkRole } = require("./../../../auth/check-role");

router
    .get("/:id", updateCookie, checkJwt, checkRole, async function (req, res, next) {
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
    .get("/", updateCookie, checkJwt, checkRole, async function (req, res, next) {
        const query = req.query.q || "";
        try {
            const data = await prisma.user.findMany({
                include: {
                    userGroup: true,
                },
                where: {
                    OR: [{ name: { contains: query } }, { phone: { contains: query } }, { id: parseInt(query) || undefined }],
                },
            });
            res.json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    });

module.exports = router;
