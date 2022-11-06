var express = require("express");
var router = express.Router();

const prisma = require ("./../../../utils/prisma");
const { checkJwt } = require("./../../../auth/check-jwt");

router.get("/", checkJwt, async function (req, res, next) {
    const data = await prisma.OrderStatus.findMany();
    res.json(data);
});

module.exports = router;
