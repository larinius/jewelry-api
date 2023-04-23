var express = require("express");
const { checkJwt } = require("../../../auth/check-jwt");
var router = express.Router();

const prisma = require("./../../../utils/prisma");

router
    .get("/:id", checkJwt, async function (req, res, next) {
        const id = parseInt(req.params.id) || 0;

        const data = await prisma.Settings.findUnique({
            where: {
                id: id,
            },
            include: {
                title: true,
                value: true,
            },
        });

        res.json(data);
    })
    .get("/", async function (req, res, next) {
        try {
            const settings = await prisma.Settings.findMany();

            res.json(settings);
        } catch (error) {
            res.sendStatus(400);
        }
    })

    .post("/", checkJwt, async function (req, res, next) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user.userId,
                },
            });

            // Only admins can edit settings
            if (user.userGroupId !== 3) {
                throw new Error("User not allowed to edit settings");
            }

            const { title, value } = req.body;

            const newSetting = await prisma.Settings.create({
                data: {
                    title,
                    value,
                },
            });

            res.json(newSetting);
        } catch (error) {
            res.sendStatus(400);
        }
    })

    .put("/:id", checkJwt, async function (req, res, next) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user.userId,
                },
            });

            // Only admins can update settings
            if (user.userGroupId !== 3) {
                throw new Error("User not allowed to update settings");
            }

            const id = parseInt(req.params.id) || 0;
            const { title, value } = req.body;

            const updatedSetting = await prisma.Settings.update({
                where: {
                    id: id,
                },
                data: {
                    title,
                    value,
                },
            });

            res.json(updatedSetting);
        } catch (error) {
            res.sendStatus(400);
        }
    })

    .delete("/:id", checkJwt, async function (req, res, next) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user.userId,
                },
            });

            // Only admins can delete settings
            if (user.userGroupId !== 3) {
                throw new Error("User not allowed to delete settings");
            }

            const id = parseInt(req.params.id) || 0;

            const deletedSetting = await prisma.Settings.delete({
                where: {
                    id: id,
                },
            });

            res.json(deletedSetting);
        } catch (error) {
            res.sendStatus(400);
        }
    });

module.exports = router;
