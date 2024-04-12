const express = require('express')
const { newFoodItem, updateFoodItem, deleteFoodItem, menu } = require('../controller/foodItemsController')
const { authorizeRoles, authenticate11 } = require('../middleware/authenticate')
const app = express()
const router = new express.Router()



// Add Food Items to the Menu --Admin
router.route("/add").post(authenticate11, authorizeRoles("admin") ,newFoodItem)

// Get All Food Items --Menu
router.route("/menu").get(menu)

// Update Food Items --Admin
router.route("/update/:id").patch(authenticate11,authorizeRoles("admin") , updateFoodItem)

// Delete Food Items --Admin
router.route("/delete/:id").delete(authenticate11,authorizeRoles("admin"), deleteFoodItem)



module.exports = router