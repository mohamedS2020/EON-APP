const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    // Add a reference to the Product model for ratings and comments
    ratedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    commentedProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ],
    role: {
      type: String,
      enum: ["Student", "Admin"],
    },
    avatar: { type: String },
  },
  // To save the date ex: (created at: time, updated at: time)
  { timestamps: true }
);
module.exports = mongoose.model("user", UserSchema);

