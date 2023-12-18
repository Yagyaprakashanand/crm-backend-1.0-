const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/auth.configs");

function verifyAdmin(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(403).send("Token is not present");
  }
  jwt.verify(token, SECRET_KEY, function (err, decoded) {
    if (err) {
      res.status(403).send("Invalid token");
    } else if (decoded.userType === "ADMIN") {
      next();
    } else {
      res.status(403).send("Only admins can call this API");
    }
  });
}

function verifyJwtToken(req, res, next) {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send("Token is not present");
  }

  jwt.verify(token, SECRET_KEY, function (err, decoded) {
    if (err) {
      res.status(401).send("Unauthenticated user");
    } else {
      req.userId = decoded.userId;
      req.userType = decoded.userType;
      next();
    }
  });
}
module.exports = {
  verifyAdmin: verifyAdmin,
  verifyJwtToken: verifyJwtToken,
};
