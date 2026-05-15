const express = require("express");

const {
  getNotifications,
  markNotificationRead,
} = require(
  "../controllers/notificationController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();


// GET NOTIFICATIONS
router.get(
  "/",
  protect,
  getNotifications
);


// MARK AS READ
router.put(
  "/:id/read",
  protect,
  markNotificationRead
);


module.exports = router;