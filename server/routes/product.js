const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./tokenVerification");
const Product  = require("../models/Product");
const router = require("express").Router();
//Add new product
router.post("/", verifyTokenAndAdmin, async(req, res) => {
    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});
//UPDATE
router.put("/:id", verifyTokenAndAdmin, async(req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, {
                $set: req.body,
            }, 
            { new: true });
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete
router.delete("/:id", verifyTokenAndAdmin, async(req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Successfully deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});
//get product
router.get("/find/:id", async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});
//get all product
router.get("/", async(req, res) => {
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


        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});
//search by name, categories , brand , size , color , description

router.get("/search/products" , async(req, res) =>{
    try{
        const {key , page , limit} = req.query
        const skip = (page - 1) * limit
        const search = key ? {
            "$or": [
                    {name: {$regex: key , $options: "$i"}},
                    {brand: {$regex: key , $options: "$i"}},
                    {description : {$regex: key , $options: "$i"}},  
            ]
        } : {}
        const products = await Product.find(search).skip(skip).limit(limit)
        res.status(200).json({products})
    }catch (err) {
        res.status(500).json(err);
    }
});

// POST /product/:productId/rate
router.post("/:productId/rate", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const { rating } = req.body;
        const productId = req.params.productId;

        // Find the product by id
        const product = await Product.findById(productId);

        // Check if product was found
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Initialize ratings array if it doesn't exist
        if (!product.ratings) {
            product.ratings = [];
        }

        // Add the rating to the product
        product.ratings.push({ user: req.user._id, rating });
        
        // Recalculate the overall rating
        const totalRating = product.ratings.reduce((acc, curr) => acc + curr.rating, 0);
        product.overallRating = totalRating / product.ratings.length;

        // Save the product
        await product.save();

        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// POST /product/:productId/comment
router.post("/:productId/comment", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const { comment } = req.body;
        const productId = req.params.productId;

        // Find the product by id
        const product = await Product.findById(productId);

        // Check if product was found
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Initialize comments array if it doesn't exist
        if (!product.comments) {
            product.comments = [];
        }

        // Add the comment to the product
        product.comments.push({ user: req.user._id, comment });

        // Save the product
        await product.save();

        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});


// DELETE /admin/comments/:commentId
router.delete("/comments/:commentId", verifyTokenAndAdmin, async (req, res) => {
    const commentId = req.params.commentId;

    try {
        // Find the product that contains the comment
        const product = await Product.findOne({ 'comments._id': commentId });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Remove the comment from the product
        product.comments = product.comments.filter(comment => comment._id.toString() !== commentId);
        
        // Save the updated product
        await product.save();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;