const { PrismaClient } = require("@prisma/client");

let prisma;

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient({
            //log: ["query", "info", "warn", "error"],
            log: ["error"],
        });
    }
    prisma = global.prisma;
}

module.exports = prisma;