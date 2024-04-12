const mongoose = require("mongoose")

const foodItemsSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: [true, "Please, Enter Food Name..!"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Price of Food Item."],
        integer : true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
},{ versionKey: false })



const user = new mongoose.model("foodItem", foodItemsSchema)

module.exports = user