const express =
  require("express");

const {

  sendMentorshipRequest,

  getMentorshipRequests,

  getSingleMentorship,

  updateMentorshipStatus,

  deleteMentorshipRequest,

} = require(
  "../controllers/mentorshipController"
);

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


// ==========================================
// SEND MENTORSHIP REQUEST
// POST /mentorship/request
// ACCESS: STUDENT
// ==========================================
router.post(

  "/request",

  protect,

  sendMentorshipRequest

);


// ==========================================
// GET ALL MENTORSHIP REQUESTS
// GET /mentorship
// ACCESS: PRIVATE
// ==========================================
router.get(

  "/",

  protect,

  getMentorshipRequests

);


// ==========================================
// GET SINGLE MENTORSHIP
// GET /mentorship/:id
// ACCESS: PRIVATE
// ==========================================
router.get(

  "/:id",

  protect,

  getSingleMentorship

);


// ==========================================
// UPDATE STATUS
// PUT /mentorship/:id/status
// ACCESS: ALUMNI / ADMIN
// ==========================================
router.put(

  "/:id/status",

  protect,

  updateMentorshipStatus

);


// ==========================================
// DELETE/CANCEL REQUEST
// DELETE /mentorship/:id
// ACCESS: OWNER / ADMIN
// ==========================================
router.delete(

  "/:id",

  protect,

  deleteMentorshipRequest

);


// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports =
  router;