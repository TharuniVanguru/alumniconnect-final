const express = require("express");

const {
  createEvent,
  getEvents,
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

const router = express.Router();


// CREATE EVENT
router.post(
  "/",
  protect,
  createEvent
);


// GET ALL EVENTS
router.get(
  "/",
  protect,
  getEvents
);


// REGISTER FOR EVENT
router.post(
  "/:id/register",
  protect,
  registerEvent
);


// GET EVENT ATTENDEES
router.get(
  "/:id/attendees",
  protect,
  getEventAttendees
);


module.exports = router;