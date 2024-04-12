const User = require('../models/user')
const jwt = require('jsonwebtoken')

// "tokens.token": token}
exports.authenticate11 = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    const verifyToken = jwt.verify(token, "secret123")

    const rootUser = await User.findOne({ _id: verifyToken._id, })


    req.token = token;
    req.rootUser = rootUser;
    req.UserID = rootUser._id;

    next();
  } catch (err) {
    res.status(401).send({
      success: false,
      message: "Unauthorized : No token provided"
    })
  }
}

exports.authorizeRoles = (roles) => {
  return async (req, res, next) => {
    const token = req.cookies.jwtoken;
    const verifyToken = jwt.verify(token, "secret123")

    const rootUser = await User.findOne({ _id: verifyToken._id, })

    if (roles != rootUser.role) {
      return next(
        res.send({
          success: false,
          message: `Role: ${rootUser.role} is not allowed to access this resouce `
        })

      );
    } else {
      next()
    }
  }
}