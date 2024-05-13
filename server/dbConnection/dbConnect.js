const mongoose = require('mongoose');
const dotenv = require("dotenv");


dotenv.config();
mongoose.set('strictQuery', true);
const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Database connected");
    }catch(err) {
        console.log(err);
    }
};

module.exports = dbConnect;
