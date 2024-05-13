const router = require("express").Router();
const userRoutes = require("./user.js");
const base ="/api/v1"

router.use(`${base}`, userRoutes)

module.exports = router; 