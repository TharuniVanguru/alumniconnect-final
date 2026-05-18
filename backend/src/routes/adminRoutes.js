const express = require("express");
const multer = require("multer");

const {
  uploadExcel,
  getUsers,
  blockUser,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

const upload = multer();

const router = express.Router();

router.post(
  "/upload-excel",
  protect,
  upload.single("file"),
  uploadExcel
);

router.get(
  "/users",
  protect,
  getUsers
);

router.post(
  "/block-user",
  protect,
  blockUser
);

module.exports = router;
