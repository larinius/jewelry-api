var express = require("express");
var router = express.Router();

const prisma = require ("./../../../utils/prisma");

router.get("/", async function (req, res, next) {
    const data = await prisma.UserGroup.findMany();
    res.json(data);
});

module.exports = router;
