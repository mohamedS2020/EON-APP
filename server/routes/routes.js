const router = require("express").Router();
const userRoutes = require("./user.js");
const authRouter = require("./auth");
const productRouter = require("./product");
const cartRouter = require("./cart");
const orderRouter = require("./order");


const base ="/api/v1"

router.use(`${base}`, userRoutes)
router.use(`${base}`, authRouter)
router.use(`${base}`, productRouter)
router.use(`${base}`, cartRouter)
router.use(`${base}`, orderRouter)


module.exports = router; 