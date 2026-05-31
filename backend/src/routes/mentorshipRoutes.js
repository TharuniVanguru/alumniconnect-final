const express =
  require("express");

const {

  sendMentorshipRequest,

  getMentorshipRequests,

  getSingleMentorship,

  updateMentorshipStatus,

  submitMentorshipFeedback,

  deleteMentorshipRequest,

  getMentorshipStats,

} = require(
  "../controllers/mentorshipController"
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
// ALL ROUTES PROTECTED
// ==========================================
router.use(
  protect
);


// ==========================================
// SEND MENTORSHIP REQUEST
// POST /api/mentorship/request
// ACCESS: STUDENT
// ==========================================
router.post(

  "/request",

  sendMentorshipRequest

);


// ==========================================
// GET ALL MENTORSHIP REQUESTS
// GET /api/mentorship
// ACCESS: PRIVATE
// ==========================================
router.get(

  "/",

  getMentorshipRequests

);


// ==========================================
// MENTORSHIP ANALYTICS
// GET /api/mentorship/stats
// ACCESS: ALUMNI / ADMIN
// ==========================================
router.get(

  "/stats",

  getMentorshipStats

);


// ==========================================
// GET SINGLE MENTORSHIP
// GET /api/mentorship/:id
// ACCESS: PRIVATE
// ==========================================
router.get(

  "/:id",

  getSingleMentorship

);


// ==========================================
// UPDATE MENTORSHIP STATUS
// PUT /api/mentorship/:id/status
// ACCESS: ALUMNI / ADMIN
// ==========================================
router.put(

  "/:id/status",

  updateMentorshipStatus

);


// ==========================================
// SUBMIT FEEDBACK
// PUT /api/mentorship/:id/feedback
// ACCESS: STUDENT
// ==========================================
router.put(

  "/:id/feedback",

  submitMentorshipFeedback

);


// ==========================================
// DELETE MENTORSHIP
// DELETE /api/mentorship/:id
// ACCESS: OWNER / ADMIN
// ==========================================
router.delete(

  "/:id",

  deleteMentorshipRequest

);


// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports =
  router;