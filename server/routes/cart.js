// routes/cart.js
const router = require("express").Router();
const {
    createCart,
    updateCart,
    deleteCart,
    getUserCart,
    getAllCarts
} = require("../Controllers/cartController");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require("../utils/tokenVerification");

router.post("/", verifyToken, createCart);
router.put("/:id", verifyTokenAndAuthorization, updateCart);
router.delete("/:id", verifyTokenAndAuthorization, deleteCart);
router.get("/find/:userId", verifyTokenAndAuthorization, getUserCart);
router.get("/", verifyTokenAndAdmin, getAllCarts);

module.exports = router;
