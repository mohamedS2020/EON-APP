const router = require("express").Router();
const userRoutes = require("./user.js");
const authRouter = require("./auth");
const productRouter = require("./product");
const cartRouter = require("./cart");
const orderRouter = require("./order");

const base ="/api"

router.use(`${base}/users`, userRoutes)
router.use(`${base}/auth`, authRouter)
router.use(`${base}/products`, productRouter)
router.use(`${base}/cart`, cartRouter)
router.use(`${base}/orders`, orderRouter)


module.exports = router; 