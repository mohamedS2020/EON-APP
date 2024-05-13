const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(403).json("Token is not valid!");
      }
      req.user = user; // Assign the decoded user to req.user here
      console.log("Decoded user:", req.user);
      if (req.user.role === "Admin") { // Now use req.user.role to check the role
        console.log("User is an admin");
      } else {
        console.log("User is not an admin");
      }
      next();
    });
  } else {
    return res.status(401).json("Authentication failed");
  }
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

module.exports = { verifyTokenAndAuthorization, verifyToken , verifyTokenAndAdmin };