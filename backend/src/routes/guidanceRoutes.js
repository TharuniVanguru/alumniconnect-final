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
// =========================
router.post(
  "/",
  protect,
  createRequest
);


// =========================
// GET ALUMNI REQUESTS
// =========================
router.get(
  "/alumni",
  protect,
  getMyRequests
);


// =========================
// GET STUDENT REQUESTS
// =========================
router.get(
  "/student",
  protect,
  getStudentRequests
);


// =========================
// UPDATE STATUS
// =========================
router.put(
  "/:id",
  protect,
  updateStatus
);


module.exports =
  router;