const express = require('express')
const { newOrder, getAllOrder, userOrders, changeStatus, deleteOrder } = require('../controller/orderController')
const { authenticate11, authorizeRoles } = require('../middleware/authenticate')
const app = express()
const router = new express.Router()

// Add ORder by user
router.route("/add").post(authenticate11, newOrder)

// Get all Orders -Admin
router.route("/all").get(authenticate11, authorizeRoles("admin"), getAllOrder)

// Logged-in User Orders 
router.route("/userorders").get(authenticate11, userOrders)

// Change Status Of Order And Payment 
router.route("/change_status").patch(authenticate11, authorizeRoles("admin"), changeStatus)

// Delete Orders 
router.route("/delete").delete(authenticate11, authorizeRoles("admin"), deleteOrder)
module.exports = router