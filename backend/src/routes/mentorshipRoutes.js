const express =
  require("express");

const {

  sendMentorshipRequest,

  getMentorshipRequests,

  updateMentorshipStatus,

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


// ======================================
// SEND MENTORSHIP REQUEST
// POST /mentorship/request
// ACCESS: STUDENT
// ======================================
router.post(

  "/request",

  protect,

  sendMentorshipRequest

);


// ======================================
// GET ALL MENTORSHIP REQUESTS
// GET /mentorship
// ACCESS: PRIVATE
// ======================================
router.get(

  "/",

  protect,

  getMentorshipRequests

);


// ======================================
// UPDATE REQUEST STATUS
// PUT /mentorship/:id/status
// ACCESS: ALUMNI / ADMIN
// ======================================
router.put(

  "/:id/status",

  protect,

  updateMentorshipStatus

);


// ======================================
// EXPORT ROUTER
// ======================================
module.exports =
  router;