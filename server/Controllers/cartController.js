// controllers/cartController.js
const Cart = require("../models/Cart");

const createCart = async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(201).json({ message: "Cart created successfully", data: savedCart });
    } catch (err) {
        res.status(500).json({ message: "Error creating cart", error: err });
    }
};

const updateCart = async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json({ message: "Cart updated successfully", data: updatedCart });
    } catch (err) {
        res.status(500).json({ message: "Error updating cart", error: err });
    }
};

const deleteCart = async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Cart deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting cart", error: err });
    }
};

const getUserCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json({ message: "User cart retrieved successfully", data: cart });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving user cart", error: err });
    }
};

const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json({ message: "All carts retrieved successfully", data: carts });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving carts", error: err });
    }
};

module.exports = {
    createCart,
    updateCart,
    deleteCart,
    getUserCart,
    getAllCarts
};
