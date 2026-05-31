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


// ==========================================
// ROUTER
// ==========================================
const router =
  express.Router();


// ==========================================
// PUBLIC ROUTES
// ==========================================


// ==========================================
// GET ALL EVENTS
// ==========================================
router.get(

  "/",

  getEvents

);


// ==========================================
// GET SINGLE EVENT
// ==========================================
router.get(

  "/:id",

  getSingleEvent

);


// ==========================================
// PROTECTED ROUTES
// ==========================================


// ==========================================
// CREATE EVENT
// ONLY ALUMNI / ADMIN
// ==========================================
router.post(

  "/",

  protect,

  createEvent

);


// ==========================================
// UPDATE EVENT
// OWNER OR ADMIN
// ==========================================
router.put(

  "/:id",

  protect,

  updateEvent

);


// ==========================================
// DELETE EVENT
// OWNER OR ADMIN
// ==========================================
router.delete(

  "/:id",

  protect,

  deleteEvent

);


// ==========================================
// REGISTER FOR EVENT
// ONLY STUDENTS
// ==========================================
router.post(

  "/:id/register",

  protect,

  registerEvent

);


// ==========================================
// GET EVENT ATTENDEES
// OWNER OR ADMIN
// ==========================================
router.get(

  "/:id/attendees",

  protect,

  getEventAttendees

);


// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports =
  router;