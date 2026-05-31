const Event =
  require("../models/Event");


// ==========================================
// CREATE EVENT
// ==========================================
const createEvent =
  async (req, res) => {

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


      // ====================================
      // VALIDATION
      // ====================================
      if (

        !title ||
        !description ||
        !date

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please fill required fields",

        });

      }


      // ====================================
      // ONLY ALUMNI / ADMIN
      // ====================================
      if (

        req.user.role !== "alumni"

        &&

        req.user.role !== "admin"

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Only alumni/admin can create events",

        });

      }


      // ====================================
      // CREATE EVENT
      // ====================================
      const event =
        await Event.create({

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

          organizer:
            req.user._id,

          organizerName:
            req.user.name,

        });


      // ====================================
      // RESPONSE
      // ====================================
      res.status(201).json({

        success: true,

        message:
          "Event created successfully",

        event,

      });

    }

    catch (error) {

      console.log(
        "CREATE EVENT ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// GET ALL EVENTS
// ==========================================
const getEvents =
  async (req, res) => {

    try {

      const events =
        await Event.find({

          isActive: true,

        })

          .populate(

            "organizer",

            "name role"

          )

          .sort({

            date: 1,

          });


      res.status(200).json({

        success: true,

        total:
          events.length,

        events,

      });

    }

    catch (error) {

      console.log(
        "GET EVENTS ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// GET SINGLE EVENT
// ==========================================
const getSingleEvent =
  async (req, res) => {

    try {

      const event =
        await Event.findById(

          req.params.id

        ).populate(

          "organizer",

          "name role email"

        );


      if (!event) {

        return res.status(404).json({

          success: false,

          message:
            "Event not found",

        });

      }


      res.status(200).json({

        success: true,

        event,

      });

    }

    catch (error) {

      console.log(
        "GET SINGLE EVENT ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// UPDATE EVENT
// ==========================================
const updateEvent =
  async (req, res) => {

    try {

      const event =
        await Event.findById(
          req.params.id
        );


      if (!event) {

        return res.status(404).json({

          success: false,

          message:
            "Event not found",

        });

      }


      // ====================================
      // OWNER OR ADMIN
      // ====================================
      if (

        event.organizer.toString() !==

          req.user._id.toString()

        &&

        req.user.role !== "admin"

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      // ====================================
      // UPDATE FIELDS
      // ====================================
      Object.assign(

        event,

        req.body

      );


      const updatedEvent =
        await event.save();


      res.status(200).json({

        success: true,

        message:
          "Event updated successfully",

        event:
          updatedEvent,

      });

    }

    catch (error) {

      console.log(
        "UPDATE EVENT ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// DELETE EVENT
// ==========================================
const deleteEvent =
  async (req, res) => {

    try {

      const event =
        await Event.findById(
          req.params.id
        );


      if (!event) {

        return res.status(404).json({

          success: false,

          message:
            "Event not found",

        });

      }


      // ====================================
      // OWNER OR ADMIN
      // ====================================
      if (

        event.organizer.toString() !==

          req.user._id.toString()

        &&

        req.user.role !== "admin"

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      await event.deleteOne();


      res.status(200).json({

        success: true,

        message:
          "Event deleted successfully",

      });

    }

    catch (error) {

      console.log(
        "DELETE EVENT ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// REGISTER EVENT
// ==========================================
const registerEvent =
  async (req, res) => {

    try {

      // ====================================
      // ONLY STUDENT
      // ====================================
      if (
        req.user.role !== "student"
      ) {

        return res.status(403).json({

          success: false,

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

          success: false,

          message:
            "Event not found",

        });

      }


      // ====================================
      // EVENT ACTIVE CHECK
      // ====================================
      if (!event.isActive) {

        return res.status(400).json({

          success: false,

          message:
            "Event inactive",

        });

      }


      // ====================================
      // DEADLINE CHECK
      // ====================================
      if (

        event.registrationDeadline &&

        new Date() >

        new Date(
          event.registrationDeadline
        )

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Registration closed",

        });

      }


      // ====================================
      // ALREADY REGISTERED
      // ====================================
      const alreadyRegistered =
        event.attendees.find(

          (attendee) =>

            attendee.student.toString()

            ===

            req.user._id.toString()

        );


      if (alreadyRegistered) {

        return res.status(400).json({

          success: false,

          message:
            "Already registered",

        });

      }


      // ====================================
      // MAX LIMIT
      // ====================================
      if (

        event.maxAttendees &&

  event.attendees.length >=
  event.maxAttendees

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Event full",

        });

      }


      // ====================================
      // REGISTER
      // ====================================
      event.attendees.push({

        student:
          req.user._id,

        studentName:
          req.user.name,

        studentEmail:
          req.user.email,

      });


      await event.save();


      res.status(200).json({

        success: true,

        message:
          "Registered successfully",

      });

    }

    catch (error) {

      console.log(
        "REGISTER EVENT ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// GET EVENT ATTENDEES
// ==========================================
const getEventAttendees =
  async (req, res) => {

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

          success: false,

          message:
            "Event not found",

        });

      }


      // ====================================
      // OWNER OR ADMIN
      // ====================================
      if (

        event.organizer.toString() !==

          req.user._id.toString()

        &&

        req.user.role !== "admin"

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      res.status(200).json({

        success: true,

        total:
          event.attendees.length,

        attendees:
          event.attendees,

      });

    }

    catch (error) {

      console.log(
        "GET ATTENDEES ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// EXPORTS
// ==========================================
module.exports = {

  createEvent,

  getEvents,

  getSingleEvent,

  updateEvent,

  deleteEvent,

  registerEvent,

  getEventAttendees,

};