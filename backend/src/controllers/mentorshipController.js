const Mentorship =
  require("../models/Mentorship");

const Notification =
  require("../models/Notification");

const User =
  require("../models/User");


// ======================================
// SEND MENTORSHIP REQUEST
// POST /mentorship/request
// ACCESS: STUDENT
// ======================================
const sendMentorshipRequest =
  async (req, res) => {

    try {

      // =========================
      // ONLY STUDENTS
      // =========================
      if (
        req.user.role !== "student"
      ) {

        return res.status(403).json({
          message:
            "Only students can request mentorship",
        });

      }


      // =========================
      // BODY DATA
      // =========================
      const {
        alumniId,
        message,
        domain,
      } = req.body;


      // =========================
      // VALIDATION
      // =========================
      if (!alumniId) {

        return res.status(400).json({
          message:
            "Alumni ID is required",
        });

      }


      // =========================
      // FIND ALUMNI
      // =========================
      const alumni =
        await User.findById(
          alumniId
        );

      if (!alumni) {

        return res.status(404).json({
          message:
            "Alumni not found",
        });

      }


      // =========================
      // CHECK ROLE
      // =========================
      if (
        alumni.role !== "alumni"
      ) {

        return res.status(400).json({
          message:
            "Selected user is not alumni",
        });

      }


      // =========================
      // CHECK DUPLICATE REQUEST
      // =========================
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
          message:
            "Mentorship request already sent",
        });

      }


      // =========================
      // CREATE REQUEST
      // =========================
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

          status:
            "Pending",

        });


      // =========================
      // CREATE NOTIFICATION
      // =========================
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

        relatedId:
          mentorship._id,

      });


      // =========================
      // RESPONSE
      // =========================
      res.status(201).json({

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
        message:
          "Server Error",
      });

    }

  };


// ======================================
// GET MENTORSHIP REQUESTS
// GET /mentorship
// ACCESS: PRIVATE
// ======================================
const getMentorshipRequests =
  async (req, res) => {

    try {

      let mentorships = [];


      // =========================
      // STUDENT REQUESTS
      // =========================
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


      // =========================
      // ALUMNI REQUESTS
      // =========================
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


      // =========================
      // ADMIN
      // =========================
      else {

        mentorships =
          await Mentorship.find()

          .sort({
            createdAt: -1,
          });

      }


      res.status(200).json(
        mentorships
      );

    }

    catch (error) {

      console.log(
        "Get Mentorship Error:",
        error
      );

      res.status(500).json({
        message:
          "Server Error",
      });

    }

  };


// ======================================
// UPDATE MENTORSHIP STATUS
// PUT /mentorship/:id/status
// ACCESS: ALUMNI / ADMIN
// ======================================
const updateMentorshipStatus =
  async (req, res) => {

    try {

      const mentorship =
        await Mentorship.findById(
          req.params.id
        );


      // =========================
      // CHECK REQUEST
      // =========================
      if (!mentorship) {

        return res.status(404).json({
          message:
            "Mentorship request not found",
        });

      }


      // =========================
      // AUTHORIZATION
      // =========================
      if (

        mentorship.alumni.toString() !==
          req.user._id.toString()

        &&

        req.user.role !== "admin"

      ) {

        return res.status(403).json({
          message:
            "Not authorized",
        });

      }


      // =========================
      // UPDATE DATA
      // =========================
      mentorship.status =
        req.body.status ||
        mentorship.status;

      mentorship.scheduledDate =
        req.body.scheduledDate ||
        mentorship.scheduledDate;

      mentorship.meetingLink =
        req.body.meetingLink ||
        mentorship.meetingLink;


      // =========================
      // SAVE
      // =========================
      const updatedMentorship =
        await mentorship.save();


      // =========================
      // ACCEPT NOTIFICATION
      // =========================
      if (
        req.body.status === "Accepted"
      ) {

        await Notification.create({

          recipient:
            mentorship.student,

          sender:
            req.user._id,

          title:
            "Mentorship Accepted",

          message:
            `${req.user.name} accepted your mentorship request`,

          type:
            "Mentorship",

          relatedId:
            mentorship._id,

        });

      }


      // =========================
      // REJECT NOTIFICATION
      // =========================
      if (
        req.body.status === "Rejected"
      ) {

        await Notification.create({

          recipient:
            mentorship.student,

          sender:
            req.user._id,

          title:
            "Mentorship Rejected",

          message:
            `${req.user.name} rejected your mentorship request`,

          type:
            "Mentorship",

          relatedId:
            mentorship._id,

        });

      }


      // =========================
      // RESPONSE
      // =========================
      res.status(200).json({

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
        message:
          "Server Error",
      });

    }

  };


// ======================================
// EXPORTS
// ======================================
module.exports = {

  sendMentorshipRequest,

  getMentorshipRequests,

  updateMentorshipStatus,

};