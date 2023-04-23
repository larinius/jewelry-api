var express = require("express");
var router = express.Router();

const prisma = require ("./../../../utils/prisma");
const { checkJwt } = require("./../../../auth/check-jwt");
const { updateCookie } = require("./../../../auth/update-cookie");
const { checkRole } = require("./../../../auth/check-role");

router.get("/", updateCookie, checkJwt, checkRole, async function (req, res, next) {
    const data = await prisma.UserGroup.findMany();
    res.json(data);
});

module.exports = router;
