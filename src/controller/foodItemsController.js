const Food = require("../models/foodItemsSchema")

// DataBase connection
const connectDatabase = require("../db/conn");
const Cookies = require("cookies");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
connectDatabase()

// Add Food Items --Admin
exports.newFoodItem = catchAsyncError(async (req, res, next) => {
     const user = req.rootUser._id
    const {foodName, price} = req.body
    const a_foodItem = await Food.find({ foodName: req.body.foodName })
    if(price<=0) return next(new ErrorHandler("please Enter Appropriate Price" , 200))
    if (a_foodItem.length == 0) {
        const newFoodItem = new Food({foodName, price, user})

        const saveFoodItem = await newFoodItem.save()

        res.status(201).json({
            success: true,
            message: "Food Item Has Been Added SUccessfully..!",
            result: {
                _id: saveFoodItem._id,
                foodName: saveFoodItem.foodName,
                price: saveFoodItem.price,
                user: saveFoodItem.user
            }

        })
    }
    else {
        return next(new ErrorHandler("This Item Is already exist in menu..!", 422))
    }
})

// Update Food Items --Admin
exports.updateFoodItem = catchAsyncError(async (req, res, next) => {
    const _id = req.params.id
    const { price, foodName } = req.body
    const updateFood = await Food.findByIdAndUpdate({ _id }, { price, foodName }, { new: true })
    if (updateFood) {
        res.status(200).json({
            success: true,
            message: "Update Successfully",
            result: {
                _id: updateFood._id,
                foodName: updateFood.foodName,
                price: updateFood.price,
                description: updateFood.description
            }
        })
    } else {
        return next(new ErrorHandler("Food Item Not Found..!", 404))
    }
})

// Delete Food Items --Admin
exports.deleteFoodItem = catchAsyncError(async (req, res, next) => {
    const _id = req.params.id
    const deleteFood = await Food.findByIdAndDelete(_id)
    if (!deleteFood || deleteFood == null) {
        return next(new ErrorHandler("Item Not Found..!", 404))

    } else {
        return res.status(201).json({
            success: true,
            messege: "Item Deleted Successfully"
        })
    }
})

// Get All Items 
exports.menu = catchAsyncError(async (req, res) => {
    const menu = await Food.find()
    if (menu.length == 0) {
        return next(new ErrorHandler("No Items Found..!", 404))
    } else {
        return res.status(201).json({
            success: true,
            result: menu
        })
    }
})

