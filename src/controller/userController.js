const User = require("../models/user")
const bcrypt = require("bcrypt")
const ErrorHandler = require("../utils/errorHandler")
const jwt = require("jsonwebtoken")
const nodeMailer = require("nodemailer")
const randomstring = require("randomstring")
const catchAsyncError = require("../middleware/catchAsyncError")

// DataBase connection
const connectDatabase = require("../db/conn");
const Cookies = require("cookies");
const user = require("../models/foodItemsSchema")
connectDatabase()

exports.newUser = catchAsyncError(async (req, res, next) => {
    const { username, email, password, cpassword } = req.body
    const userExist = await User.findOne({ email })
    if (userExist) {
        return next(new ErrorHandler("Email Already Exists..!", 422))
    } else if (password != cpassword) {
        return next(new ErrorHandler("Password And Confirm Password Are Difference..!", 422))
    } else {
        const user = new User({ username, email, password })
        const userRegister = await user.save()
        res.status(201).json({
            success: true,
            message: "User register successfully",
            result: {
                id: userRegister._id,
                username: userRegister.username,
                email: userRegister.email,
                role: userRegister.role
            }
        })
    }
})



// Login User 
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.jwtoken;
    if (!token) {
        const { email, password } = req.body
        const user = await User.findOne({
            email
        })

        if (!password && !email) {
            return next(new ErrorHandler("Please Enter Email & Password", 422))
        }
        if (!email) {
            return next(new ErrorHandler("Please Enter Email", 422))
        }
        if (!password) {
            return next(new ErrorHandler("Please Enter Password", 422))
        }

        if (user == null) return next(new ErrorHandler("Invalid Credentials", 422))
        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (isPasswordValid) {
            let token = await user.generateAuthToken()

            res.cookie("jwtoken", token, {
                expiresIn: 10 * 60 * 1000,
                httpOnly: true
            })

            res.status(200).send({
                success: true,
                message: "Login Successfull..!",
                result: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            })
        } else {
            return next(new ErrorHandler("Invalid Credentials", 422))
        }
    } else {
        return next(new ErrorHandler("You Are Already Loggedin", 422))
    }


})

// User Profile
exports.userProfile = catchAsyncError(async (req, res, next) => {
    const { _id, username, email, role } = req.rootUser
    return res.status(200).json({
        success: true,
        result: { id:_id, username, email, role }
    })
})

// Logout 
exports.logoutUser = catchAsyncError(async (req, res) => {

    res.clearCookie("jwtoken");

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
})

// Get all users record  
exports.getAllUser = catchAsyncError(async (req, res) => {
    const getUsers = await User.find().select('_id username email role')
    if (getUsers) {
        return res.status(200).json({
            success: true,
            result: getUsers
        })
    } else {
        return res.send({ message: "There are no users " })
    }
})

// Get particular User 
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const _id = req.params.id
    const getUser = await User.findById(_id)
    if (!getUser) {
        return next(new ErrorHandler("User Not Found..!", 404))
    } else {
        return res.json({
            success: true,
            result: {
                id: getUser._id,
                username: getUser.username,
                email: getUser.email,
                role: getUser.role
            }
        })
    }
}
)
// Update particular User
exports.updateUser = catchAsyncError(async (req, res, next) => {
    const _id = req.rootUser._id

    const { username, email } = req.body

    const sameEmail = await User.findOne({ email })

    if (sameEmail) next(new ErrorHandler("Email Already Exists..!", 422))
    const updateUser = await User.findByIdAndUpdate(_id, { $set: { username, email } }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(201).json({
        success: true,
        message: "User Updated Successfully..!",
        result: {
            id: updateUser._id,
            username: updateUser.username,
            email: updateUser.email,
            role: updateUser.role
        }
    })



})

// reset Password --2
exports.resetPassword_2 = catchAsyncError(async (req, res, next) => {
    const _id = req.rootUser._id
    const { password, cpassword } = req.body

    const user = await User.findById({ _id })

    if (password != cpassword) {
        return next(new ErrorHandler("Password And Confirm Password Are Difference..!", 422))
    }
    user.password = password

    const resetPassword = await user.save()
    res.clearCookie("jwtoken");
    return res.status(200).json({
        success: true,
        message: "Password Reset Succssfully..!"
    })

})
// Forgot Password --2
exports.forgotPassword_2 = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.jwtoken
    if (!token) {
        const { email, password, cpassword } = req.body

        const validEmail = await User.findOne({ email })
        if (!validEmail) return next(new ErrorHandler("Please Enter Valid Email", 422))

        if (password != cpassword) {
            return next(new ErrorHandler("Password And Confirm Password Are Difference..!", 422))
        }

        validEmail.password = password
        // validEmail.cpassword = cpassword

        const updatePassword = await validEmail.save()
        return res.status(200).json({
            success: true,
            message: "Password Update Succssfully..!"
        })

    } else {
        return res.send({ message: "You are already logged in..! You can Reset the password. from reset URL.!" })
    }

})

// update user role
exports.updateUserRoles = catchAsyncError(async (req, res, next) => {
    const { _id, role } = req.body
    const lowerCaseRole = role.toLowerCase()
    if (lowerCaseRole == "admin" || lowerCaseRole == "user") {
        const exists = await User.findById({ _id })
        if (exists) {
            const updateUserRole = await User.findByIdAndUpdate(_id, { role: lowerCaseRole }, { new: true })
            return res.status(200).json({
                success: true,
                message: "Role Updated Successfully",
                result: {
                    id: updateUserRole._id,
                    username: updateUserRole.username,
                    email: updateUserRole.email,
                    role: updateUserRole.role
                }
            })
        } else {
            return next(new ErrorHandler("User does not exists, Please enter valid User Id", 422))
        }
    } else {
        res.send({
            message: "This role is not available in this, olny Admin and User roles are available, so enter from these role only"
        })
    }
})

// Delete User
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const _id = req.params.id
    const deleteUser = await User.findByIdAndDelete(_id)
    if (!deleteUser) return next(new ErrorHandler("This user is not avilable in database", 422))
    else {
        return res.status(201).json({
            success: true,
            messege: "User Deleted Successfully"
        })
    }
})












































// if (!password && !cpassword) {
//     return next(new ErrorHandler("Please Enter Password & Confirm Password", 422))
// }
// if (password.lemgth < 4) return next(new ErrorHandler("Password should have more than 4 characters", 422))
// if (!password) {
//     return next(new ErrorHandler("Please Enter Password", 422))
// }
// if (!cpassword) {
//     return next(new ErrorHandler("Please Enter Confirm Password", 422))
// }


// password => Hash
// var hashPassword = await bcrypt.hash(password, 10)

// // Compare Password and Confirm Passwrd
// const compare = await bcrypt.compare(cpassword, hashPassword)
// if (compare == true) {
//     const user = new User({ password: hashPassword })
//     const resetpassword = await User.findByIdAndUpdate(_id, { password: hashPassword }, {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false,
//     })
//     res.clearCookie("jwtoken");
//     return res.status(200).send(
//         { message: "Password updated Successfully" }
//     )
// } else {
//     return res.send({
//         message: "Password and Confirm Password are different"
//     })
// }


// if (!email) return next(new ErrorHandler("Please Enter Email", 422))
// if (password == null || password == "") return next(new ErrorHandler("Please Enter Password", 422))
// if (password.lemgth < 4) return next(new ErrorHandler("Password should have more than 4 characters", 422))
// if (cpassword == null || cpassword == "") return next(new ErrorHandler("Please Enter Confirm Password", 422))


// // password => Hash
// var hashPassword = await bcrypt.hash(password, 10)
// console.log(hashPassword)
// // Compare Password and Confirm Passwrd
// const compare = await bcrypt.compare(cpassword, hashPassword)
// if (compare == true) {
//     const newPassword = await User.findByIdAndUpdate(validEmail._id, { password: hashPassword }, {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false,
//     })
//     return res.status(200).send(
//         { newPassword, message: "Password updated Successfully" }
//     )
// } else {
//     return res.status(200).send({
//         message: "Password and Confirm Password are different"
//     })
// }







// Register User
exports.RegisterUser = async (req, res) => {
    try {
        // Get data from user 
        const { username, email, role, password, cpassword } = req.body

        // if(!username && !email && !password&& !cpassword) {
        //     return res.send({
        //         success : false ,
        //         message : "All fields are required..!"
        //     })
        // }
        // if(!username)

        // Username Validation
        const alreadyUser = await User.findOne({ username })
        // if (alreadyUser) return res.send({ message: "Username already Exists..! Please Enter new Username." })
        // if (alreadyUser) return res.status(200).json({
        //     status:'success',
        //     data:{

        //     }
        // })
        // if (username == null || username == "") return res.send({ message: "Please! Enter Username" })

        // Email validation
        // const alreadyEmail = await User.findOne({ email })
        // if (alreadyEmail) return res.send({ message: "Email already Exists..! Please Enter new email." })
        // if (email == null || email == "") return res.send({ message: "Please! Enter Email" })

        // // PAssword
        // if (password == null || password == "") return res.send({ message: "Please! Enter password" })
        // if (cpassword == null || cpassword == "") return res.send({ message: "Please! Enter Confirm password" })
        // if (password.length < 6) return res.send({ message: "password requires atleast 6 character" })

        // password => Hash
        var hashPassword = await bcrypt.hash(password, 10)

        // Compare Password and Confirm Passwrd
        const compare = await bcrypt.compare(cpassword, hashPassword)

        if (compare == true) {
            const user = new User({ username, email, password: hashPassword, role })
            console.log(user)
            const saveUser = await user.save()
            return res.status(201).send(
                saveUser
            )
        } else {
            return res.send({
                message: "Password and Confirm Password are different"
            })
        }
    } catch (e) {
        console.log("Opps! Something Went Wrong.")
        if (e.message) {
            return res.send(e)
        } else {
            return res.send(e)
        }
    }
}


const sendResetPasswordEmail = async (name, email, token) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: "19it.krishi.tanna@gmail.com",
                pass: "cslezxfpmzribdoc"
            }
        })

        const mailOptions = {
            form: "19it.krishi.tanna@gmail.com",
            to: email,
            subject: "For reset Password",
            html: "<h3> hello " + name + " you can reset your password using this link </h3> <br /> Link : <a href='http://localhost:3000/api/password/reset?token=" + token + "'> click Here <a/>"
            // text:options.message
        }

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) console.log("errorrrr : " + err)
            else console.log("mail has been sent :- " + email)
        })

    } catch (e) {
        return console.log(e)
    }
}

// Forgot password 
exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body.email
        const userdata = await User.findOne({ email })
        if (userdata) {
            const randomString = randomstring.generate()
            const data = await User.updateOne({ email }, { $set: { token: randomString } }, { new: true })
            sendResetPasswordEmail(userdata.username, userdata.email, randomString)
            return res.send({ message: "Please check your inbox" })
        } else {
            return res.send({ message: "This email does not exists." })
        }
    } catch (e) {
        res.send(e)
    }
}

// Reset password 
exports.resetPassword = async (req, res) => {
    try {
        const token = req.query.token
        const validateToken = await User.findOne({ token })
        if (validateToken) {
            const { password } = req.body
            var hashPassword = await bcrypt.hash(password, 10)
            var updatePassword = await User.findByIdAndUpdate({ _id: validateToken._id }, { password: hashPassword, token: "" }, { new: true })
            res.send({
                message: "Password has been reset successfully ..!",
                updatePassword
            })
        } else {
            return res.status(400).send({
                message: "Invalid Link"
            })
        }
    } catch (e) {
        return res.status(400).send(e)
    }
}