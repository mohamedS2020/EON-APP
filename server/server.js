// bndef el express
const express = require("express");
/* const cloudinary = require('cloudinary') */
const cors = require("cors");
/* const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order"); */
/* const bodyParser = require("body-parser"); */
const dbConnect = require("./dbConnection/dbConnect.js");
const app = express();
/* app.use(bodyParser.urlencoded({ extended: true }));
cloudinary.config({
    cloud_name: 'dpddogoro',
    api_key: '195523127174162',
    api_secret: 'QMzrQMfg-mGKk96B3HZIKyoQTHs'
}); */

app.use(cors());
/* app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter); //we go to api end user our app
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter); */
app.listen(process.env.PORT || 5005, () => {
    console.log(`server run in ${process.env.PORT || 5005}`);
    dbConnect();
});
