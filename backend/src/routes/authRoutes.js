const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


// REGISTER
router.post(
  "/register",
  registerUser
);


// LOGIN
router.post(
  "/login",
  loginUser
);

// CHANGE PASSWORD
router.post(
  "/change-password",
  protect,
  changePassword
);

// FORGOT PASSWORD
router.post(
  "/forgot-password",
  forgotPassword
);

// VERIFY OTP
router.post(
  "/verify-otp",
  verifyOtp
);

// RESET PASSWORD
router.post(
  "/reset-password",
  resetPassword
);

// LOGOUT
router.post(
  "/logout",
  protect,
  logoutUser
);


module.exports = router;