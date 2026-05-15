const Event = require("../models/Event");


// @desc    Create Event
// @route   POST /events
// @access  Alumni/Admin

const createEvent = async (
  req,
  res
) => {

  try {

    const {
      title,
      description,
      type,
      date,
      time,
      location,
      mode,
      meetingLink,
      maxAttendees,
      tags,
    } = req.body;

    // ONLY ALUMNI/ADMIN
    if (
      req.user.role !== "alumni" &&
      req.user.role !== "admin"
    ) {

      return res.status(403).json({
        message:
          "Only alumni/admin can create events",
      });

    }

    const event = await Event.create({
      title,
      description,
      type,
      date,
      time,
      location,
      mode,
      meetingLink,
      maxAttendees,
      tags,
      organizer: req.user._id,
      organizerName: req.user.name,
    });

    res.status(201).json(event);

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


// @desc    Get All Events
// @route   GET /events
// @access  Private

const getEvents = async (
  req,
  res
) => {

  try {

    const events = await Event.find({
      isActive: true,
    })
      .populate(
        "organizer",
        "name role"
      )
      .sort({
        date: 1,
      });

    res.status(200).json(events);

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


// @desc    Register For Event
// @route   POST /events/:id/register
// @access  Student

const registerEvent = async (
  req,
  res
) => {

  try {

    // ONLY STUDENTS
    if (
      req.user.role !== "student"
    ) {

      return res.status(403).json({
        message:
          "Only students can register",
      });

    }

    const event =
      await Event.findById(
        req.params.id
      );

    if (!event) {

      return res.status(404).json({
        message:
          "Event not found",
      });

    }

    // CHECK ALREADY REGISTERED
    const alreadyRegistered =
      event.attendees.find(
        (attendee) =>
          attendee.student.toString() ===
          req.user._id.toString()
      );

    if (alreadyRegistered) {

      return res.status(400).json({
        message:
          "Already registered",
      });

    }

    // CHECK LIMIT
    if (
      event.attendees.length >=
      event.maxAttendees
    ) {

      return res.status(400).json({
        message:
          "Event full",
      });

    }

    // REGISTER STUDENT
    event.attendees.push({
      student: req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email,
    });

    await event.save();

    res.status(200).json({
      message:
        "Registered successfully",
    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server Error",
    });

  }

};


// @desc    Get Event Attendees
// @route   GET /events/:id/attendees
// @access  Alumni/Admin

const getEventAttendees = async (
  req,
  res
) => {

  try {

    const event =
      await Event.findById(
        req.params.id
      ).populate(
        "attendees.student",
        "name email role"
      );

    if (!event) {

      return res.status(404).json({
        message:
          "Event not found",
      });

    }

    // OWNER OR ADMIN
    if (
      event.organizer.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {

      return res.status(403).json({
        message:
          "Not authorized",
      });

    }

    res.status(200).json(
      event.attendees
    );

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server Error",
    });

  }

};


module.exports = {
  createEvent,
  getEvents,
  registerEvent,
  getEventAttendees,
};