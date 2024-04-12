const express = require('express')
const app = express()
const router = new express.Router()

const {RegisterUser, getAllUser,loginUser, getSingleUser, updateUser, deleteUser, userProfile, logoutUser, updateUserRoles, forgotPassword, resetPassword, resetPassword_2, forgotPassword_2, newUser,} = require('../controller/userController')
const { authenticate11, authorizeRoles } = require("../middleware/authenticate")


// Register User
router.route("/register").post(newUser)

// Login User 
router.route("/login").post(loginUser)

// User Profile 
router.route("/me").get(authenticate11,userProfile)

// Update user
router.route('/user').patch(authenticate11,updateUser)

// Forgot Password
router.route("/password/forgot_2").patch(forgotPassword_2)

// Reset Password
router.route("/password/reset_2/").patch(authenticate11,resetPassword_2)

// Logout User 
router.route("/logout").get(authenticate11,logoutUser)

// Read Users using GET request
router.route("/allusers").get(authenticate11,authorizeRoles("admin"), getAllUser)

// Get particular user 
router.route('/getuser/:id').get(authenticate11,authorizeRoles("admin"), getSingleUser)

// update User Role 
router.route("/updateRole").patch(authenticate11,authorizeRoles("admin"), updateUserRoles)

// Delete user
router.route('/user/:id').delete(authenticate11,authorizeRoles("admin"),deleteUser)

module.exports = router