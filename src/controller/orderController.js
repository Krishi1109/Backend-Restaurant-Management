const Order = require("../models/orderSchema")
const Food = require("../models/foodItemsSchema")

// DataBase connection
const connectDatabase = require("../db/conn");
const Cookies = require("cookies");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
connectDatabase()

exports.newOrder = catchAsyncError(async (req, res, next) => {
    var grandTotal = 0

    const {
        table,
        orderItems,
    } = req.body;

    for (let i = 0; i < orderItems.length; i++) {
        if (!orderItems[i].quantity || orderItems[i].quantity <= 0) return res.send({ message: "Please! Enter appropriate quantity" })
        const foodItem = await Food.findById({
            _id: orderItems[i].food_id,
        })
        if (!foodItem) return next(new ErrorHandler("Item not Found..!", 404))
        orderItems[i].name = foodItem.foodName
        orderItems[i].price_Per_Item = foodItem.price
        orderItems[i].totalPrice = orderItems[i].quantity * foodItem.price
        grandTotal += orderItems[i].totalPrice
    }

    const order = await Order.create({
        table,
        orderItems,
        grandTotal,
        user: req.rootUser._id,
    });

    return res.send({
        success: true,
        message: "Order Placed Succssfully..!",
        result: order
    })
}
)
// Get all Orders record --Admin
exports.getAllOrder = catchAsyncError(async (req, res) => {
    const getOrders = await Order.find()
    if (getOrders.length == 0) {
        return next(new ErrorHandler("No orders are available..!", 404))
    } else {
        return res.status(201).json({
            success: true,
            result: getOrders
        })
    }
})

// Logged-in users Order 
exports.userOrders = catchAsyncError(async (req, res, next) => {
    const allOrders_user = await Order.find({ user: req.rootUser._id })
    if (allOrders_user.length == 0) {
        return next(new ErrorHandler("you dont hve any orders", 200))
    } else {
        return res.status(201).json({
            success: true,
            result: allOrders_user
        })
    }
})

// change status of Order and Payment --Admin
exports.changeStatus = catchAsyncError(async (req, res, next) => {
    const { order_id, paymentStatus, orderStatus } = req.body
    const  order = await Order.findById(order_id)
    let statusObj = {paymentStatus, orderStatus}
    if (order) {
        if (order.paymentStatus == "unpaid") {
            statusObj = {paymentStatus, orderStatus}
        } else if (order.orderStatus == 'pending') {
            statusObj  = { orderStatus}
        } else {
            return next(new ErrorHandler("Payment Has Already Paid", 200))
        }
        const status = await Order.findByIdAndUpdate(order_id, statusObj)
        if(status) {
            return res.status(200).json({
                success: true,
                message: "status Updated Successfully..!"
            })
        } else {
            return next(new ErrorHandler("Something Went Wrong", 200))
        }      
    }
    else {
        return next(new ErrorHandler("Resource not found. Invalid: _id"), 400)
    }
})

// delete orders After complete --Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const id = req.body.order_id
    const orderDetails = await Order.findById(_id)

    if (!orderDetails || orderDetails == null) return next(new ErrorHandler("Order not found with this id", 404))
    else if (orderDetails.orderStatus == "Pending" || orderDetails.orderStatus == "pending") return next(new ErrorHandler("Order is pending, so you can not delte this order, you can delte this order after delivered items", 200))
    else if (orderDetails.paymentStatus == "Unpaid" || orderDetails.paymentStatus == "unpaid") return next(new ErrorHandler("Payment is pending for this order, you can delete this after payment is done", 200))
    else {
        const order = await Order.findByIdAndDelete({ id })
        if(order) {
            return res.status(200).json({
                success: true,
                messege: "Order Deleted Successfully"
            })
        } else {
            return next(new ErrorHandler("Something Went Wrong",400 ))
        }
        
    }
})

























// // delete orders After complete --Admin
// exports.deleteOrder = async (req, res) => {
//     try {
//         const _id = req.body.order_id
//         const orderDetails = await Order.findById(_id)
//         console.log(orderDetails)
//         if (!orderDetails || orderDetails == null) return res.status(404).send({ message: "This Order is not avilable in database" })
//         else if (orderDetails.orderStatus == "Pending" || orderDetails.orderStatus == "pending") return res.send({ message: "Order is pending, so you can not delte this order, you can delte this order after delivered items" })
//         else if (orderDetails.paymentStatus == "Unpaid" || orderDetails.paymentStatus == "unpaid") return res.send({ message: "Payment is pending for this order, you can delete this after payment is done" })
//         else {
//             // console.log(orderDetails)
//             const order = await Order.findByIdAndDelete(_id)
//             console.log("dfcdv" + order)
//             return res.status(201).send({
//                 messege: "Order Deleted Successfully"
//             })
//         }

//     } catch (e) {
//         // console.log("error")
//         return res.status(400).send(e)
//     }
// }