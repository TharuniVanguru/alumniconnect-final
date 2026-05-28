const express =
  require("express");

const {

  registerUser,

  loginUser,

  logoutUser,

  changePassword,

  forgotPassword,

  resendOtp,

  verifyOtp,

  resetPassword,

} = require(
  "../controllers/authController"
);

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


// ==========================================
// PUBLIC ROUTES
// ==========================================


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


// FORGOT PASSWORD
router.post(

  "/forgot-password",

  forgotPassword

);


// RESEND OTP
router.post(

  "/resend-otp",

  resendOtp

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


// ==========================================
// PRIVATE ROUTES
// ==========================================


// CHANGE PASSWORD
router.put(

  "/change-password",

  protect,

  changePassword

);


// LOGOUT
router.post(

  "/logout",

  protect,

  logoutUser

);


// ==========================================
// EXPORT
// ==========================================
module.exports =
  router;