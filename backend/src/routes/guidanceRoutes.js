const express =
  require("express");

const {

  createRequest,

  getMyRequests,

  getStudentRequests,

  getSingleRequest,

  updateStatus,

  submitGuidanceFeedback,

  deleteGuidanceRequest,

  getGuidanceStats,

} = require(
  "../controllers/guidanceController"
);

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


// ==========================================
// CREATE REQUEST
// POST /guidance/request
// ==========================================
router.post(

  "/request",

  protect,

  createRequest

);


// ==========================================
// GET ALUMNI REQUESTS
// GET /guidance/alumni
// ==========================================
router.get(

  "/alumni",

  protect,

  getMyRequests

);


// ==========================================
// GET STUDENT REQUESTS
// GET /guidance/student
// ==========================================
router.get(

  "/student",

  protect,

  getStudentRequests

);


// ==========================================
// GET GUIDANCE STATS
// GET /guidance/stats
// ==========================================
router.get(

  "/stats",

  protect,

  getGuidanceStats

);


// ==========================================
// GET SINGLE REQUEST
// GET /guidance/:id
// ==========================================
router.get(

  "/:id",

  protect,

  getSingleRequest

);


// ==========================================
// UPDATE STATUS
// PUT /guidance/:id/status
// ==========================================
router.put(

  "/:id/status",

  protect,

  updateStatus

);


// ==========================================
// SUBMIT FEEDBACK
// PUT /guidance/:id/feedback
// ==========================================
router.put(

  "/:id/feedback",

  protect,

  submitGuidanceFeedback

);


// ==========================================
// DELETE REQUEST
// DELETE /guidance/:id
// ==========================================
router.delete(

  "/:id",

  protect,

  deleteGuidanceRequest

);


// ==========================================
// EXPORT
// ==========================================
module.exports =
  router;