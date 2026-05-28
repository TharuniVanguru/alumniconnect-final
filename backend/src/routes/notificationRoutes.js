const express =
  require("express");

const {

  getNotifications,

  markNotificationRead,

  markAllNotificationsRead,

  deleteNotification,

  deleteAllNotifications,

  getNotificationAnalytics,

} = require(
  "../controllers/notificationController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


// ==========================================
// GET ALL NOTIFICATIONS
// ==========================================
router.get(

  "/",

  protect,

  getNotifications

);


// ==========================================
// NOTIFICATION ANALYTICS
// ==========================================
router.get(

  "/analytics",

  protect,

  getNotificationAnalytics

);


// ==========================================
// MARK ALL AS READ
// ==========================================
router.put(

  "/read-all",

  protect,

  markAllNotificationsRead

);


// ==========================================
// MARK SINGLE AS READ
// ==========================================
router.put(

  "/:id/read",

  protect,

  markNotificationRead

);


// ==========================================
// DELETE SINGLE NOTIFICATION
// ==========================================
router.delete(

  "/:id",

  protect,

  deleteNotification

);


// ==========================================
// DELETE ALL NOTIFICATIONS
// ==========================================
router.delete(

  "/",

  protect,

  deleteAllNotifications

);


// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports =
  router;