// routes/product.js
const router = require("express").Router();
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  searchProducts,
  addComment,
  addRating,
} = require("../Controllers/productController");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("../utils/tokenVerification");

router.post("/", verifyTokenAndAdmin, addProduct);
router.put("/:id", verifyTokenAndAdmin, updateProduct);
router.delete("/:id", verifyTokenAndAdmin, deleteProduct);
router.get("/find/:id", getProduct);
router.get("/", verifyTokenAndAdmin , getAllProducts);
router.get("/search/products", searchProducts);
router.post("/:id/comment", verifyTokenAndAuthorization , addComment);
router.post("/:id/rate", verifyTokenAndAuthorization , addRating);

module.exports = router;
