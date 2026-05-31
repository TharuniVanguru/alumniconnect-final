const express =
  require("express");

const {

  getNotifications,

  markNotificationRead,

  markAllNotificationsRead,

  deleteNotification,

  deleteAllNotifications,

  getNotificationAnalytics,

  getUnreadCount,

} = require(
  "../controllers/notificationController"
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
// GET ALL NOTIFICATIONS
// GET /api/notifications
// ==========================================
router.get(

  "/",

  getNotifications

);


// ==========================================
// GET UNREAD COUNT
// GET /api/notifications/unread-count
// IMPORTANT:
// KEEP ABOVE /:id ROUTES
// ==========================================
router.get(

  "/unread-count",

  getUnreadCount

);


// ==========================================
// NOTIFICATION ANALYTICS
// GET /api/notifications/analytics
// ==========================================
router.get(

  "/analytics",

  getNotificationAnalytics

);


// ==========================================
// MARK ALL AS READ
// PUT /api/notifications/read-all
// ==========================================
router.put(

  "/read-all",

  markAllNotificationsRead

);


// ==========================================
// MARK SINGLE NOTIFICATION AS READ
// PUT /api/notifications/:id/read
// ==========================================
router.put(

  "/:id/read",

  markNotificationRead

);


// ==========================================
// DELETE SINGLE NOTIFICATION
// DELETE /api/notifications/:id
// ==========================================
router.delete(

  "/:id",

  deleteNotification

);


// ==========================================
// DELETE ALL NOTIFICATIONS
// DELETE /api/notifications
// ==========================================
router.delete(

  "/",

  deleteAllNotifications

);


// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports =
  router;