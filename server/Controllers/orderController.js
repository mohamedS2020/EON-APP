// controllers/orderController.js
const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  const { userId, Products, userAddress, totalAmount } = req.body;

  try {
    // Create a new order
    const newOrder = new Order({
      userId,
      Products,
      userAddress,
      totalAmount
    });

    // Update product stock quantities
    for (const productItem of Products) {
      const product = await Product.findById(productItem.ProductId);

      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }

      if (product.stock < productItem.purchasedQuantity) {
        return res.status(400).json({ message: `Out of stock for product: ${product.name}` });
      }

      product.stock -= productItem.purchasedQuantity;
      await product.save();
    }

    // Save the order
    const savedOrder = await newOrder.save();

    res.status(201).json({ message: "Order created successfully", data: savedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating order", error: err });
  }
};

const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );
    res.status(200).json({ message: "Order updated successfully", data: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Error updating order", error: err });
  }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling order", error: err });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json({ message: "User orders retrieved successfully", data: orders });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving user orders", error: err });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ message: "All orders retrieved successfully", data: orders });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving all orders", error: err });
  }
};

const getIncome = async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$totalAmount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json({ message: "Income data retrieved successfully", data: income });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving income data", error: err });
  }
};

module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrders,
  getAllOrders,
  getIncome,
};
