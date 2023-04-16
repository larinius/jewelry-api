var express = require("express");
var router = express.Router();

const prisma = require("../../../utils/prisma");
const randomOrderCode = require("../../../utils/randomOrderCode");

router.get("/", async function (req, res, next) {
    const maxAttempts = 3;
    let attempt = 0;
    let newCode = randomOrderCode();

    while (
        await prisma.Order.findFirst({
            where: {
                code: newCode,
            },
        })
    ) {
        attempt++;
        if (attempt >= maxAttempts) {
            res.status(500).json({ error: "Failed to generate unique order code" });
            return;
        }
        newCode = randomOrderCode();
    }

    res.json(newCode);
});

module.exports = router;
