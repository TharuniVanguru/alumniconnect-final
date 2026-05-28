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
        priority,

      } = req.body;


      // ====================================
      // VALIDATION
      // ====================================
      if (!alumniId) {

        return res.status(400).json({

          success: false,

          message:
            "Alumni ID is required",

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
      // CHECK ROLE
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

          message:
            message || "",

          domain:
            domain || "",

          priority:
            priority || "Medium",

          status:
            "Pending",

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
          `${req.user.name} requested mentorship in ${domain || "your domain"}`,

        type:
          "Mentorship",

        priority:
          priority || "Medium",

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
        "Mentorship Request Error:",
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
// GET ALL MENTORSHIP REQUESTS
// ==========================================
const getMentorshipRequests =
  async (req, res) => {

    try {

      let mentorships = [];


      // ====================================
      // STUDENT
      // ====================================
      if (
        req.user.role === "student"
      ) {

        mentorships =
          await Mentorship.find({

            student:
              req.user._id,

          })

          .sort({
            createdAt: -1,
          });

      }


      // ====================================
      // ALUMNI
      // ====================================
      else if (
        req.user.role === "alumni"
      ) {

        mentorships =
          await Mentorship.find({

            alumni:
              req.user._id,

          })

          .sort({
            createdAt: -1,
          });

      }


      // ====================================
      // ADMIN
      // ====================================
      else {

        mentorships =
          await Mentorship.find()

          .sort({
            createdAt: -1,
          });

      }


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


      res.status(200).json({

        success: true,

        analytics,

        mentorships,

      });

    }

    catch (error) {

      console.log(
        "Get Mentorship Error:",
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
      const isOwner =

        mentorship.student.toString() ===
          req.user._id.toString()

        ||

        mentorship.alumni.toString() ===
          req.user._id.toString()

        ||

        req.user.role === "admin";


      if (!isOwner) {

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

      console.log(error);

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

      mentorship.sessionNotes =
        req.body.sessionNotes ||
        mentorship.sessionNotes;


      // ====================================
      // COMPLETED
      // ====================================
      if (
        req.body.status ===
        "Completed"
      ) {

        mentorship.completedAt =
          new Date();

      }


      // ====================================
      // SAVE
      // ====================================
      const updatedMentorship =
        await mentorship.save();


      // ====================================
      // NOTIFICATION
      // ====================================
      let title =
        "Mentorship Updated";

      let message =
        `${req.user.name} updated mentorship status`;


      if (
        req.body.status ===
        "Accepted"
      ) {

        title =
          "Mentorship Accepted";

        message =
          `${req.user.name} accepted your mentorship request`;

      }


      if (
        req.body.status ===
        "Rejected"
      ) {

        title =
          "Mentorship Rejected";

        message =
          `${req.user.name} rejected your mentorship request`;

      }


      if (
        req.body.status ===
        "Completed"
      ) {

        title =
          "Mentorship Completed";

        message =
          `${req.user.name} marked mentorship as completed`;

      }


      await Notification.create({

        recipient:
          mentorship.student,

        sender:
          req.user._id,

        title,

        message,

        type:
          "Mentorship",

        relatedId:
          mentorship._id,

      });


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
        "Update Mentorship Error:",
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
        req.body.rating || 0;


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
        "Feedback Error:",
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
          "Mentorship request deleted successfully",

      });

    }

    catch (error) {

      console.log(error);

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


      const stats = {

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

        averageRating: 0,

      };


      const ratings =
        mentorships
          .filter(
            (m) => m.rating
          )
          .map(
            (m) => m.rating
          );


      if (ratings.length > 0) {

        stats.averageRating =

          (
            ratings.reduce(

              (a, b) => a + b,

              0

            ) / ratings.length

          ).toFixed(1);

      }


      res.status(200).json({

        success: true,

        stats,

      });

    }

    catch (error) {

      console.log(error);

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