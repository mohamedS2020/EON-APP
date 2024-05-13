const User = require("../models/User");
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./tokenVerification");
const bcrypt = require('bcryptjs');
const router = require("express").Router();

//UPDATE
router.put("/:id", verifyTokenAndAuthorization , async (req, res)=> {
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt),process.env.SEC_KEY.toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      {
        $set: req.body,
      },
      { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete
router.delete("/:id", verifyTokenAndAuthorization ,async (req,res) =>{
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Successfully deleted");
  }catch(err){
    res.status(500).json(err);
  }
});

//get user
router.get("/find/:id", verifyTokenAndAdmin , async (req,res) =>{
  try {
   const user = await User.findById(req.params.id);
   const { password, ...others } = user._doc;
    res.status(200).json(others);
  }catch(err){
    res.status(500).json(err);
  }
});

//get all users
router.get("/", verifyTokenAndAdmin , async (req,res) =>{
  const query = req.query.new
  try {
   const allUsers = query ? await User.find().sort({_id: -1}).limit(4) : await User.find();
    res.status(200).json(allUsers);
  }catch(err){
    res.status(500).json(err);
  }
});

//get user stats
router.get("/stats" , verifyTokenAndAdmin , async (req , res) =>{
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1 ));

  try{
    const data = await User.aggregate([
      {$match:{createdAt: { $gte : lastYear }}},
      {
        $project:{
          month: { $month: "$createdAt"},
        },
      },
      {
        $group:{
          _id: "$month",
          total:{ $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  }catch(err){
    res.status(500).json(err);
  }

});

// GET /admin/ratings-comments/:userId
router.get("/ratings-comments/:userId", verifyTokenAndAdmin , async (req, res) => {
  const userId = req.params.userId;

  try {
      // Find all products that have ratings or comments from the specified user
      const products = await Product.find({
          $or: [
              { 'ratings.user': userId },
              { 'comments.user': userId }
          ]
      });

      // Extract ratings and comments for the specified user
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
});

module.exports = router ;