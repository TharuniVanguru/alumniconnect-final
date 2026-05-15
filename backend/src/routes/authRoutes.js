const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
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


// LOGOUT
router.post(
  "/logout",
  protect,
  logoutUser
);


module.exports = router;