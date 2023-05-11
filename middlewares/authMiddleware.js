const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({"message" : "Not authorized, please login."})
    }
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Get user id from token
    const user = await User.findById(verified.id).select("-password");
    if (!user) {
      res.status(404).json({"message" : "User not found"});
    }
    req.user = user;
    next();
  } 
  catch(error) {
    res.status(401).json({"message" : "Not authorized, please login"});
  }
}


module.exports = {
    protect,
}