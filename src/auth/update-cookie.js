// Middleware function to update the cookie's expiration time
module.exports = {

updateCookie: (req, res, next) => {
  const cookieName = "serviceToken";
  const cookie = req.cookies[cookieName];
  if (cookie) {

    // const { exp } = jwt.decode(cookie);

    // if (Date.now() > exp * 1000) {
    //   res.clearCookie(cookieName);
    //   return res.redirect("/login");
    // }

    // const newExpiration = new Date();
    // newExpiration.setDate(newExpiration.getDate() + 7);
    // res.cookie(cookieName, cookie, {
    //   httpOnly: true,
    //   expires: newExpiration,
    // });
  }
  next();
},
};

