const express = require("express");

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

const router = express.Router();


// SEND REQUEST
router.post(
  "/request",
  protect,
  sendMentorshipRequest
);


// GET REQUESTS
router.get(
  "/",
  protect,
  getMentorshipRequests
);


// UPDATE STATUS
router.put(
  "/:id/status",
  protect,
  updateMentorshipStatus
);


module.exports = router;