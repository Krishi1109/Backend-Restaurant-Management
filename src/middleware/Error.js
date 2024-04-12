const ErrorHandler = require("../utils/errorHandler")

const errorMiddleware = (err, req, res, next) => {

    err.message = err.message || "Internal Seerver Error"
    err.statusCode = err.statusCode || 500

    // Wrong mongodb ID error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    // if(err.keyPattern.email === 1){
    //     err.message = "Email : Duplicate key error"
    //     err.statusCode =  400
    // }
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })

}

module.exports = errorMiddleware