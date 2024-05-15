// routes/user.js
const router = require("express").Router();
const {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  getUserStats,
  getRatingsAndComments
} = require("../Controllers/userController");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("../utils/tokenVerification");

router.put("/:id", verifyTokenAndAuthorization, updateUser);
router.delete("/:id", verifyTokenAndAuthorization, deleteUser);
router.get("/find/:id", verifyTokenAndAdmin, getUser);
router.get("/", verifyTokenAndAdmin, getAllUsers);
router.get("/stats", verifyTokenAndAdmin, getUserStats);
router.get("/ratings-comments/:userId", verifyTokenAndAdmin, getRatingsAndComments);

module.exports = router;
