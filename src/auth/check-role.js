const prisma = require("./../../../utils/prisma");

const checkRole = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
    });

    if (user.userGroupId !== 3) {
      throw new Error("User is not an admin");
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "User not authorized or not an admin" });
  }
};
