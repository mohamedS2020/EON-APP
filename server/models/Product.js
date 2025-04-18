const mongoose = require("mongoose")
const {Schema} = mongoose;

const ProductSchema = new Schema(
    {
        name:{type: String , required:true, unique:true},
        description:{type: String , required:true},
        categories: {
            type: Array,
            default: [],
        },
        image: {type: Array , required: true},
        size: {type: Array},
        color: {type: String},
        price: {type: Number , required: true},
        brand : {type: String , required : true , default: "Generic"},
        condition: {type: String , required: true , default: "New"},
        Stock:{type:Number , default:0},
        ratings: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                rating: { type: Number, required: true }
            }
        ],
        comments: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                comment: { type: String, required: true }
            }
        ],
        overallRating: { type: Number, default: 0 }
    },
    //to save the date ex:(created at: time , updated at: time)
    {timestamps: true}
);
module.exports = mongoose.model("Product" , ProductSchema);