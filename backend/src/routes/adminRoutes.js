const express =
  require("express");

const multer =
  require("multer");

const {

  uploadExcel,

  getUsers,

  blockUser,

  getDashboardAnalytics,

} = require(
  "../controllers/adminController"
);

const {

  protect,

  adminOnly,

} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


// ==========================================
// MULTER CONFIG
// ==========================================
const upload =
  multer({

    limits: {

      fileSize:
        10 * 1024 * 1024,

    },

  });


// ==========================================
// ADMIN DASHBOARD ANALYTICS
// ==========================================
router.get(

  "/analytics",

  protect,

  adminOnly,

  getDashboardAnalytics

);


// ==========================================
// GET ALL USERS
// ==========================================
router.get(

  "/users",

  protect,

  adminOnly,

  getUsers

);


// ==========================================
// BLOCK / UNBLOCK USER
// ==========================================
router.post(

  "/block-user",

  protect,

  adminOnly,

  blockUser

);


// ==========================================
// EXCEL USER IMPORT
// ==========================================
router.post(

  "/upload-excel",

  protect,

  adminOnly,

  upload.single("file"),

  uploadExcel

);


// ==========================================
// TEST ROUTE
// ==========================================
router.get(

  "/",

  protect,

  adminOnly,

  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "Admin Routes Working",

    });

  }

);


// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports =
  router;