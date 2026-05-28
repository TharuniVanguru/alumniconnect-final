const express =
  require("express");

const {

  getMyProfile,

  updateProfile,

  getProfileById,

  getAllAlumni,

  getChatUsers,

} = require(
  "../controllers/profileController"
);

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


// ==========================================
// GET MY PROFILE
// ==========================================
router.get(

  "/me",

  protect,

  getMyProfile

);


// ==========================================
// UPDATE PROFILE
// ==========================================
router.put(

  "/update",

  protect,

  updateProfile

);


// ==========================================
// GET ALL ALUMNI
// ==========================================
router.get(

  "/alumni",

  protect,

  getAllAlumni

);


// ==========================================
// GET CHAT USERS
// ==========================================
router.get(

  "/chat-users",

  protect,

  getChatUsers

);


// ==========================================
// GET PROFILE BY ID
// ==========================================
router.get(

  "/:id",

  protect,

  getProfileById

);


// ==========================================
// EXPORT
// ==========================================
module.exports =
  router;