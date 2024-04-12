const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const validator = require("validator");
const crypto = require('crypto')
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        // unique: [true, "afdg"],
        required: [true, "Please Enter Your Userame"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Username should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter PAssword"],
        minLength: [4, "Password should have more than 4 characters"],
    },
    // cpassword: {
    //     type: String,
    //     required : [true, "Please Enter Confirm PAssword"],
    // },
    role: {
        type: String,
        require: true,
        default: "user"
    },
}, { versionKey: false })

// Like.... Middleware
userSchema.pre('save' ,async  function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
        // this.cpassword = await bcrypt.hash(this.cpassword, 12)
        next()
    }
})


userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, "secret123")
        return token
    } catch (err) {
        console.log(err)
    }
};

// generating Password reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Getnerating token 
    const resetToken = crypto.randomBytes(20).toString("hex")

    //Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")   
        .update(resetToken)
        .digest("hex")

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    return resetToken

}

const user = new mongoose.model("User", userSchema)

module.exports = user