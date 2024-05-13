// bndef el express
const express = require("express");
const cors = require("cors");
const dbConnect = require("./dbConnection/dbConnect.js");
const routes = require("./routes/routes.js");
const app = express();

app.use(cors());
app.use("/" , routes)
app.listen(process.env.PORT || 5005, () => {
    console.log(`server run in ${process.env.PORT || 5005}`);
    dbConnect();
});
