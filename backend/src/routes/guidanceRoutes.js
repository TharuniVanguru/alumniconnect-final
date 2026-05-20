const express =
  require("express");

const {

  createRequest,

  getMyRequests,

  getStudentRequests,

  updateStatus,

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


// =========================
// CREATE REQUEST
// POST /guidance/request
// =========================
router.post(

  "/request",

  protect,

  createRequest

);


// =========================
// GET ALUMNI REQUESTS
// GET /guidance/alumni
// =========================
router.get(

  "/alumni",

  protect,

  getMyRequests

);


// =========================
// GET STUDENT REQUESTS
// GET /guidance/student
// =========================
router.get(

  "/student",

  protect,

  getStudentRequests

);


// =========================
// UPDATE STATUS
// PUT /guidance/:id/status
// =========================
router.put(

  "/:id/status",

  protect,

  updateStatus

);


// =========================
// EXPORT
// =========================
module.exports =
  router;