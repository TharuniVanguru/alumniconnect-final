const Mentorship =
  require("../models/Mentorship");

const Notification =
  require("../models/Notification");

const User =
  require("../models/User");


// ==========================================
// SEND MENTORSHIP REQUEST
// ==========================================
const sendMentorshipRequest =
  async (req, res) => {

    try {

      // ====================================
      // ONLY STUDENTS
      // ====================================
      if (
        req.user.role !== "student"
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Only students can request mentorship",

        });

      }


      // ====================================
      // BODY DATA
      // ====================================
      const {

        alumniId,
        message,
        domain,
        mentorshipType,

      } = req.body;


      // ====================================
      // VALIDATION
      // ====================================
      if (
        !alumniId ||
        !message
      ) {

        return res.status(400).json({

          success: false,

          message:
            "alumniId and message are required",

        });

      }


      // ====================================
      // FIND ALUMNI
      // ====================================
      const alumni =
        await User.findById(
          alumniId
        );

      if (!alumni) {

        return res.status(404).json({

          success: false,

          message:
            "Alumni not found",

        });

      }


      // ====================================
      // ROLE CHECK
      // ====================================
      if (
        alumni.role !== "alumni"
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Selected user is not alumni",

        });

      }


      // ====================================
      // DUPLICATE CHECK
      // ====================================
      const existingRequest =
        await Mentorship.findOne({

          student:
            req.user._id,

          alumni:
            alumniId,

          status:
            "Pending",

        });

      if (existingRequest) {

        return res.status(400).json({

          success: false,

          message:
            "Mentorship request already sent",

        });

      }


      // ====================================
      // CREATE REQUEST
      // ====================================
      const mentorship =
        await Mentorship.create({

          student:
            req.user._id,

          studentName:
            req.user.name,

          alumni:
            alumniId,

          alumniName:
            alumni.name,

          message,

          domain:
            domain || "",

          mentorshipType:
            mentorshipType ||
            "General Mentorship",

        });


      // ====================================
      // CREATE NOTIFICATION
      // ====================================
      await Notification.create({

        recipient:
          alumniId,

        sender:
          req.user._id,

        title:
          "New Mentorship Request",

        message:
          `${req.user.name} requested mentorship`,

        type:
          "mentorship",

        relatedId:
          mentorship._id,

      });


      // ====================================
      // RESPONSE
      // ====================================
      res.status(201).json({

        success: true,

        message:
          "Mentorship request sent successfully",

        mentorship,

      });

    }

    catch (error) {

      console.log(
        "SEND MENTORSHIP ERROR:",
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
// GET MENTORSHIP REQUESTS
// ==========================================
const getMentorshipRequests =
  async (req, res) => {

    try {

      let filter = {};


      // ====================================
      // ROLE BASED FILTER
      // ====================================
      if (
        req.user.role === "student"
      ) {

        filter.student =
          req.user._id;

      }

      else if (
        req.user.role === "alumni"
      ) {

        filter.alumni =
          req.user._id;

      }


      // ====================================
      // FETCH
      // ====================================
      const mentorships =
        await Mentorship.find(
          filter
        )

          .populate(
            "student",
            "name email role profileImage"
          )

          .populate(
            "alumni",
            "name email role profileImage"
          )

          .sort({

            createdAt: -1,

          });


      // ====================================
      // ANALYTICS
      // ====================================
      const analytics = {

        total:
          mentorships.length,

        pending:
          mentorships.filter(

            (m) =>
              m.status ===
              "Pending"

          ).length,

        accepted:
          mentorships.filter(

            (m) =>
              m.status ===
              "Accepted"

          ).length,

        completed:
          mentorships.filter(

            (m) =>
              m.status ===
              "Completed"

          ).length,

        rejected:
          mentorships.filter(

            (m) =>
              m.status ===
              "Rejected"

          ).length,

      };


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        analytics,

        mentorships,

      });

    }

    catch (error) {

      console.log(
        "GET MENTORSHIP ERROR:",
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
// GET SINGLE MENTORSHIP
// ==========================================
const getSingleMentorship =
  async (req, res) => {

    try {

      const mentorship =
        await Mentorship.findById(
          req.params.id
        )

          .populate(
            "student",
            "name email role profileImage"
          )

          .populate(
            "alumni",
            "name email role profileImage"
          );


      if (!mentorship) {

        return res.status(404).json({

          success: false,

          message:
            "Mentorship not found",

        });

      }


      // ====================================
      // ACCESS CONTROL
      // ====================================
      const allowed =

        mentorship.student._id.toString() ===
          req.user._id.toString()

        ||

        mentorship.alumni._id.toString() ===
          req.user._id.toString()

        ||

        req.user.role === "admin";


      if (!allowed) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      res.status(200).json({

        success: true,

        mentorship,

      });

    }

    catch (error) {

      console.log(
        "GET SINGLE ERROR:",
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
// UPDATE MENTORSHIP STATUS
// ==========================================
const updateMentorshipStatus =
  async (req, res) => {

    try {

      const mentorship =
        await Mentorship.findById(
          req.params.id
        );

      if (!mentorship) {

        return res.status(404).json({

          success: false,

          message:
            "Mentorship request not found",

        });

      }


      // ====================================
      // AUTHORIZATION
      // ====================================
      if (

        mentorship.alumni.toString() !==
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
      mentorship.status =
        req.body.status ||
        mentorship.status;

      mentorship.scheduledDate =
        req.body.scheduledDate ||
        mentorship.scheduledDate;

      mentorship.meetingLink =
        req.body.meetingLink ||
        mentorship.meetingLink;

      mentorship.mentorNotes =
        req.body.mentorNotes ||
        mentorship.mentorNotes;


      // ====================================
      // SAVE
      // ====================================
      const updatedMentorship =
        await mentorship.save();


      // ====================================
      // CREATE NOTIFICATION
      // ====================================
      await Notification.create({

        recipient:
          mentorship.student,

        sender:
          req.user._id,

        title:
          "Mentorship Updated",

        message:
          `Your mentorship request status changed to ${mentorship.status}`,

        type:
          "mentorship",

        relatedId:
          mentorship._id,

      });


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        message:
          "Mentorship updated successfully",

        mentorship:
          updatedMentorship,

      });

    }

    catch (error) {

      console.log(
        "UPDATE MENTORSHIP ERROR:",
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
// SUBMIT FEEDBACK
// ==========================================
const submitMentorshipFeedback =
  async (req, res) => {

    try {

      const mentorship =
        await Mentorship.findById(
          req.params.id
        );

      if (!mentorship) {

        return res.status(404).json({

          success: false,

          message:
            "Mentorship not found",

        });

      }


      // ====================================
      // ONLY STUDENT
      // ====================================
      if (

        mentorship.student.toString() !==
        req.user._id.toString()

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      mentorship.feedback =
        req.body.feedback || "";

      mentorship.rating =
        req.body.rating || null;


      await mentorship.save();


      res.status(200).json({

        success: true,

        message:
          "Feedback submitted successfully",

        mentorship,

      });

    }

    catch (error) {

      console.log(
        "FEEDBACK ERROR:",
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
// DELETE MENTORSHIP REQUEST
// ==========================================
const deleteMentorshipRequest =
  async (req, res) => {

    try {

      const mentorship =
        await Mentorship.findById(
          req.params.id
        );

      if (!mentorship) {

        return res.status(404).json({

          success: false,

          message:
            "Mentorship not found",

        });

      }


      // ====================================
      // OWNER OR ADMIN
      // ====================================
      if (

        mentorship.student.toString() !==
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


      await mentorship.deleteOne();


      res.status(200).json({

        success: true,

        message:
          "Mentorship deleted successfully",

      });

    }

    catch (error) {

      console.log(
        "DELETE MENTORSHIP ERROR:",
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
// GET MENTORSHIP STATS
// ==========================================
const getMentorshipStats =
  async (req, res) => {

    try {

      const mentorships =
        await Mentorship.find({

          alumni:
            req.user._id,

        });


      const ratings =
        mentorships

          .filter(
            (m) => m.rating
          )

          .map(
            (m) => m.rating
          );


      const averageRating =

        ratings.length > 0

          ? (
              ratings.reduce(

                (a, b) => a + b,

                0

              ) / ratings.length

            ).toFixed(1)

          : 0;


      res.status(200).json({

        success: true,

        stats: {

          totalSessions:
            mentorships.length,

          completedSessions:
            mentorships.filter(

              (m) =>
                m.status ===
                "Completed"

            ).length,

          pendingSessions:
            mentorships.filter(

              (m) =>
                m.status ===
                "Pending"

            ).length,

          acceptedSessions:
            mentorships.filter(

              (m) =>
                m.status ===
                "Accepted"

            ).length,

          averageRating,

        },

      });

    }

    catch (error) {

      console.log(
        "MENTORSHIP STATS ERROR:",
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

  sendMentorshipRequest,

  getMentorshipRequests,

  getSingleMentorship,

  updateMentorshipStatus,

  submitMentorshipFeedback,

  deleteMentorshipRequest,

  getMentorshipStats,

};