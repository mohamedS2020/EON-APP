// utils/tokenVerification.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authentication failed: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWTPRIVATEKEY, (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ message: "Token is not valid" });
    }

    req.user = user;
    console.log('Decoded user:', req.user);
    next();
  });
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.role === "Admin") {
      next();
    } else {
      res.status(403).json("Access denied");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "Admin") {
      next();
    } else {
      res.status(403).json("Access denied");
    }
  });
};

module.exports = { verifyTokenAndAuthorization, verifyToken, verifyTokenAndAdmin };
