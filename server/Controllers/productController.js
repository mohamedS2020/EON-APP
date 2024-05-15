// controllers/productController.js
const Product = require("../models/Product");
const User = require("../models/User");

const addProduct = async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product added successfully", data: savedProduct });
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({ message: "Product retrieved successfully", data: product });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving product", error: err });
  }
};

const getAllProducts = async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(2);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json({ message: "Products retrieved successfully", data: products });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving products", error: err });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { key, page, limit } = req.query;
    const skip = (page - 1) * limit;
    const search = key
      ? {
          $or: [
            { name: { $regex: key, $options: "i" } },
            { brand: { $regex: key, $options: "i" } },
            { description: { $regex: key, $options: "i" } },
          ],
        }
      : {};
    const products = await Product.find(search).skip(skip).limit(limit);
    res.status(200).json({ message: "Products searched successfully", data: products });
  } catch (err) {
    res.status(500).json({ message: "Error searching products", error: err });
  }
};


const addComment = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication failed: No user ID found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = {
      user: userId,
      comment,
    };
    product.comments.push(newComment);
    await product.save();

    // Update user's commentedProducts
    user.commentedProducts.push(productId);
    await user.save();

    res.status(200).json({ message: "Comment added successfully" });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const addRating = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication failed: No user ID found" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating. Rating should be between 1 and 5." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has already rated this product
    const existingRating = product.ratings.find(r => r.user.toString() === userId);
    if (existingRating) {
      existingRating.rating = rating; // Update existing rating
    } else {
      // Add new rating
      product.ratings.push({ user: userId, rating });
    }

    // Calculate the overall rating
    const totalRating = product.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    product.overallRating = totalRating / product.ratings.length;

    // Save the product
    await product.save();

    // Update user's ratedProducts
    user.ratedProducts.push(productId);
    await user.save();

    res.status(200).json({ message: "Rating added successfully", overallRating: product.overallRating });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  searchProducts,
  addComment,
  addRating,
};
