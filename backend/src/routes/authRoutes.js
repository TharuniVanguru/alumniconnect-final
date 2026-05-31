// ==========================================
// IMPORTS
// ==========================================
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

  getMe,

} = require(
  "../controllers/authController"
);

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);


// ==========================================
// ROUTER
// ==========================================
const router =
  express.Router();


// ==========================================
// TEST ROUTE
// GET /api/auth/test
// ==========================================
router.get(

  "/test",

  (req, res) => {

    return res.status(200).json({

      success: true,

      message:
        "Auth Route Working Properly",

    });

  }

);


// ==========================================
// PUBLIC ROUTES
// ==========================================


// ==========================================
// REGISTER USER
// POST /api/auth/register
// ==========================================
router.post(

  "/register",

  registerUser

);


// ==========================================
// LOGIN USER
// POST /api/auth/login
// ==========================================
router.post(

  "/login",

  loginUser

);


// ==========================================
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// ==========================================
router.post(

  "/forgot-password",

  forgotPassword

);


// ==========================================
// RESEND OTP
// POST /api/auth/resend-otp
// ==========================================
router.post(

  "/resend-otp",

  resendOtp

);


// ==========================================
// VERIFY OTP
// POST /api/auth/verify-otp
// ==========================================
router.post(

  "/verify-otp",

  verifyOtp

);


// ==========================================
// RESET PASSWORD
// POST /api/auth/reset-password
// ==========================================
router.post(

  "/reset-password",

  resetPassword

);


// ==========================================
// PRIVATE ROUTES
// ==========================================


// ==========================================
// GET CURRENT USER
// GET /api/auth/me
// ==========================================
router.get(

  "/me",

  protect,

  getMe

);


// ==========================================
// CHANGE PASSWORD
// PUT /api/auth/change-password
// ==========================================
router.put(

  "/change-password",

  protect,

  changePassword

);


// ==========================================
// LOGOUT USER
// POST /api/auth/logout
// ==========================================
// protect intentionally removed
// allows logout even after token expiry
router.post(

  "/logout",

  logoutUser

);


// ==========================================
// CHECK AUTH
// GET /api/auth/check-auth
// ==========================================
router.get(

  "/check-auth",

  protect,

  (req, res) => {

    return res.status(200).json({

      success: true,

      authenticated: true,

      user: {

        _id:
          req.user._id,

        identifier:
          req.user.identifier,

        name:
          req.user.name,

        email:
          req.user.email,

        role:
          req.user.role,

        profileImage:
          req.user.profileImage || "",

        isOnline:
          req.user.isOnline,

        isFirstLogin:
          req.user.isFirstLogin,

      },

    });

  }

);


// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports =
  router;