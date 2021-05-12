const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const token = req.header("authorization-token");
  if (!token) {
    // if token doesnt exist
    return res.status(401).send("Access Denied");
  }
  try {
    const userVerified = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(userVerified);
    req.user = userVerified;
    next();
  } catch (error) {
    return res.status(401).send("Access Denied");
  }
};
