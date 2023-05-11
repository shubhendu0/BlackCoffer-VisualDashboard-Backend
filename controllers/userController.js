const User = require("../models/userModel");
const Token = require("../models/tokenModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/token");
var uaparser = require("ua-parser-js");

const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.CRYPTR_KEY);

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


//---------------------------Registration--------------------------------//

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({"message" : "Please fill all the required fields."});
  }
  // Check if user exists
  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return res.status(400).json({"message" : "Email already in use."});
  }
    // Extracting User-Agent
    const ua = uaparser(req.headers["user-agent"]);
    const userAgent = [ua.ua];
    // Hashing Password
    const hashedPwd = await bcrypt.hash(password, 10);
    //create and store the new user
    const user = await User.create({
      name,
      email,
      password: hashedPwd,
      userAgent,
    })
    if(user){  
      // Generate Token
      const token = generateToken(user._id);
      // Send HTTP-only cookie
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
      })
      // Generate 6 digit loginCode
      const loginCode = Math.floor(100000 + Math.random() * 900000);
      // Encrypt login code before saving to DB
      const encryptedLoginCode = cryptr.encrypt(loginCode.toString());
      // Save Token to DB
      await new Token({
        userId: user._id,
        lToken: encryptedLoginCode,
        createdAt: Date.now(),
        expiresAt: Date.now() + 60 * (24 * 60 * 1000), // 1 day
      }).save();
     
      const { _id, name, email, photo, userAgent } = user;
      res.status(201).json({
        _id,
        name, 
        email, 
        photo,
        userAgent, 
        token,
      });
    }
    else{
      res.status(400).json({"message" : "Invalid Details."});
    }
}


//---------------------------Login--------------------------------//

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //   Validation
  if (!email || !password) {
    return res.status(400).json({"message" : "Please add email and password"});
  }
  let user = await User.findOne({ email : email });
  // Check if user exists
  if(!user){
    return res.json({ "message" : "User not registered." })
  }
  // Compare Password
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if(passwordIsCorrect){
    // Extracting User-Agent
    const ua = uaparser(req.headers["user-agent"]);
    const newUserAgent = ua.ua;
    const allowedAgent = user.userAgent.includes(newUserAgent);    
    if(!allowedAgent){
      // Pushing new UserAgent in User-Agent field of user document
      await User.updateOne(
        { email : user.email },        
        { $push: { userAgent : newUserAgent } }            
      )
      // Generate 6 digit code
      const loginCode = Math.floor(100000 + Math.random() * 900000);
      console.log(loginCode);
      // Encrypt login code before saving to DB
      const encryptedLoginCode = cryptr.encrypt(loginCode.toString());
      // Delete Token if it exists in DB
      let userToken = await Token.findOne({ userId: user._id });
      if (userToken) {
        await userToken.deleteOne();
      }
      // Save Token to DB
      await new Token({
        userId: user._id,
        lToken: encryptedLoginCode,
        createdAt: Date.now(),
        expiresAt: Date.now() + 60 * (24 * 60 * 1000), // 1 day
      }).save();
      res.status(200).json({"message" : "New browser or device detected"});
    }
    // Generate Token
    const token = generateToken(user._id);
    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    })
    const { _id, name, email, photo, userAgent } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      userAgent,
      token,
    });
  } 
  else{
    return res.status(400).json({ "message" : "Password didn't match." })
  }
}


//---------------------------Login Status--------------------------------//

const loginStatus = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  // Verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
}


//---------------------------Get User--------------------------------//

const getUser = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { _id, name, email, photo } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
    });
  } 
  else {
    res.status(404).json({"message" : "User not found"});
  }
}


//---------------------------Logout--------------------------------//

const logoutUser = async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // 1 day
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ "message" : "Logout successful" });
}


//--------------------------Google Sign-in--------------------------------//

const loginWithGoogle = async (req, res) => {
  const { userToken } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: userToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { name, email, picture, sub } = payload;
  const password = Date.now() + sub;
  // Get UserAgent
  const ua = uaparser(req.headers["user-agent"]);
  const userAgent = [ua.ua];
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    //   Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      photo: picture,
      userAgent,
    });

    if (newUser) {
      // Generate Token
      const token = generateToken(newUser._id);
      // Send HTTP-only cookie
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
      });
      const { _id, name, email, photo } = newUser;
      res.status(201).json({
        _id,
        name,
        email,
        photo,
        token,
      });
    }
  }
  // User exists, login
  if (user) {
    const token = generateToken(user._id);
    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });
    const { _id, name, email, photo} = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      token,
    });
  }
}


module.exports = {
  registerUser,
  loginUser,
  loginStatus,
  getUser,
  logoutUser,
  loginWithGoogle,
}