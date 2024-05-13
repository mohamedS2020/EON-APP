const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./tokenVerification");

const router = require("express").Router();
//create

// POST /order
router.post("/", verifyToken, async (req, res) => {
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
            const product = await Product.findById(productItem.productId);

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

        res.status(200).json(savedOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
//UPDATE
router.put("/:id", verifyTokenAndAdmin, async(req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, {
                $set: req.body,
            }, 
            { new: true });
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete
router.delete("/:id", verifyTokenAndAdmin , async(req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been cancelled");
    } catch (err) {
        res.status(500).json(err);
    }
});

//get user Orders
router.get("/find/:userId", verifyTokenAndAuthorization, async(req, res) => {
    try {
        const orders = await Order.find({userId: req.params.userId});
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get all 
router.get("/", verifyTokenAndAdmin , async(req,res)=>{
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
});

//get income by month
router.get("/income" , verifyTokenAndAdmin , async(req , res)=>{
    const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1 ));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1 ));  
  try{
    const income = await Order.aggregate([
      {$match:{createdAt: { $gte : previousMonth }}},
      {
        $project:{
          month: { $month: "$createdAt"},
          sales:"$totalAmount",
        },
      },
      {
        $group:{
          _id: "$month",
          total:{ $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  }catch(err){
    res.status(500).json(err);
  } 
});
module.exports = router;