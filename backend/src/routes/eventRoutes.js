const express =
  require("express");

const {

  createEvent,

  getEvents,

  getSingleEvent,

  updateEvent,

  deleteEvent,

  registerEvent,

  getEventAttendees,

} = require(
  "../controllers/eventController"
);

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


// ==========================================
// CREATE EVENT
// ==========================================
router.post(
  "/",
  protect,
  createEvent
);


// ==========================================
// GET ALL EVENTS
// ==========================================
router.get(
  "/",
  protect,
  getEvents
);


// ==========================================
// GET SINGLE EVENT
// ==========================================
router.get(
  "/:id",
  protect,
  getSingleEvent
);


// ==========================================
// UPDATE EVENT
// ==========================================
router.put(
  "/:id",
  protect,
  updateEvent
);


// ==========================================
// DELETE EVENT
// ==========================================
router.delete(
  "/:id",
  protect,
  deleteEvent
);


// ==========================================
// REGISTER FOR EVENT
// ==========================================
router.post(
  "/:id/register",
  protect,
  registerEvent
);


// ==========================================
// GET EVENT ATTENDEES
// ==========================================
router.get(
  "/:id/attendees",
  protect,
  getEventAttendees
);


// ==========================================
// EXPORT
// ==========================================
module.exports =
  router;