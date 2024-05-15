// controllers/userController.js
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const Product = require("../models/Product");

const updateUser = async (req, res) => {
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: "User updated successfully", data: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json({ message: "User retrieved successfully", data: others });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving user", error: err });
  }
};

const getAllUsers = async (req, res) => {
  const query = req.query.new;
  try {
    const allUsers = query ? await User.find().sort({_id: -1}).limit(4) : await User.find();
    res.status(200).json({ message: "All users retrieved successfully", data: allUsers });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving all users", error: err });
  }
};

const getUserStats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { 
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      { 
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({ message: "User statistics retrieved successfully", data: data });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving user statistics", error: err });
  }
};

const getRatingsAndComments = async (req, res) => {
  const userId = req.params.userId;

  try {
    const products = await Product.find({
      $or: [
        { 'ratings.user': userId },
        { 'comments.user': userId }
      ]
    });

    const ratingsAndComments = products.map(product => {
      const productRatings = product.ratings.filter(rating => rating.user.toString() === userId);
      const productComments = product.comments.filter(comment => comment.user.toString() === userId);

      return {
        productId: product._id,
        productName: product.name,
        ratings: productRatings,
        comments: productComments
      };
    });

    res.status(200).json(ratingsAndComments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  getUserStats,
  getRatingsAndComments
};
