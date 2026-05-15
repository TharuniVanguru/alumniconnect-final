const express = require("express");

const {
  getMyProfile,
  updateProfile,
  getProfileById,
  getAllAlumni,
} = require("../controllers/profileController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================
// GET LOGGED-IN USER PROFILE
// =====================================

router.get(
  "/me",
  protect,
  getMyProfile
);


// =====================================
// UPDATE PROFILE
// =====================================

router.put(
  "/update",
  protect,
  updateProfile
);


// =====================================
// GET ALL ALUMNI
// =====================================

router.get(
  "/alumni",
  protect,
  getAllAlumni
);


// =====================================
// GET PROFILE BY ID
// =====================================

router.get(
  "/:id",
  protect,
  getProfileById
);


// EXPORT ROUTER
module.exports = router;