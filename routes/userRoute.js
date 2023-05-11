const express = require("express");
const router = express.Router();
const {
  protect,
} = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  loginStatus,
  getUser,
  logoutUser,
  loginWithGoogle,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/loginStatus", loginStatus);
router.get("/getUser",protect, getUser);
router.get("/logout", logoutUser);
router.post("/google/callback", loginWithGoogle);

module.exports = router;
