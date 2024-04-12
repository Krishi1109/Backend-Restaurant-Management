const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    table : {
        type: Number,
        require : [true, "Please Enter Table Number"]
    },
    orderItems: [
        {
            name: {
                type: String,
                // required: true,
            },
            price_Per_Item: {
                type: Number,
                // required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            totalPrice : {
                type : Number,
            },
            food_id : {
                type: mongoose.Schema.ObjectId,
                ref: "foodItems",
                required: true,
            },
        },
    ],

    grandTotal : {
        type:Number 
    },
    paymentType : {
        type:String,
        default : "CASH ON DELIVERY"
    },
    paymentStatus :{
        type:String,
        default : "unpaid"
    },
    orderStatus :{
        type:String,
        default : "pending"
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
},{ versionKey: false })


const order = new mongoose.model("Order", orderSchema)

module.exports = order