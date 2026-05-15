const Mentorship = require(
  "../models/Mentorship"
);

const Notification = require(
  "../models/Notification"
);


// @desc    Send Mentorship Request
// @route   POST /mentorship/request
// @access  Student

const sendMentorshipRequest =
  async (req, res) => {

    try {

      // ONLY STUDENTS
      if (
        req.user.role !== "student"
      ) {

        return res.status(403).json({
          message:
            "Only students can request mentorship",
        });

      }

      const {
        alumniId,
        alumniName,
        message,
        domain,
      } = req.body;

      // CHECK EXISTING REQUEST
      const existingRequest =
        await Mentorship.findOne({
          student: req.user._id,
          alumni: alumniId,
          status: "Pending",
        });

      if (existingRequest) {

        return res.status(400).json({
          message:
            "Request already sent",
        });

      }

      const mentorship =
        await Mentorship.create({
          student: req.user._id,
          studentName:
            req.user.name,
          alumni: alumniId,
          alumniName,
          message,
          domain,
        });

      // CREATE NOTIFICATION
      await Notification.create({
        recipient: alumniId,

        sender: req.user._id,

        title:
          "New Mentorship Request",

        message:
          `${req.user.name} requested mentorship in ${domain}`,

        type: "Mentorship",

        relatedId: mentorship._id,
      });

      res.status(201).json(
        mentorship
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


// @desc    Get Mentorship Requests
// @route   GET /mentorship
// @access  Private

const getMentorshipRequests =
  async (req, res) => {

    try {

      let mentorships;

      // STUDENT REQUESTS
      if (
        req.user.role === "student"
      ) {

        mentorships =
          await Mentorship.find({
            student: req.user._id,
          }).sort({
            createdAt: -1,
          });

      }

      // ALUMNI REQUESTS
      else if (
        req.user.role === "alumni"
      ) {

        mentorships =
          await Mentorship.find({
            alumni: req.user._id,
          }).sort({
            createdAt: -1,
          });

      }

      // ADMIN
      else {

        mentorships =
          await Mentorship.find().sort({
            createdAt: -1,
          });

      }

      res.status(200).json(
        mentorships
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


// @desc    Update Mentorship Status
// @route   PUT /mentorship/:id/status
// @access  Alumni/Admin

const updateMentorshipStatus =
  async (req, res) => {

    try {

      const mentorship =
        await Mentorship.findById(
          req.params.id
        );

      if (!mentorship) {

        return res.status(404).json({
          message:
            "Mentorship request not found",
        });

      }

      // ONLY OWNER OR ADMIN
      if (
        mentorship.alumni.toString() !==
          req.user._id.toString() &&
        req.user.role !== "admin"
      ) {

        return res.status(403).json({
          message:
            "Not authorized",
        });

      }

      mentorship.status =
        req.body.status ||
        mentorship.status;

      mentorship.scheduledDate =
        req.body.scheduledDate ||
        mentorship.scheduledDate;

      mentorship.meetingLink =
        req.body.meetingLink ||
        mentorship.meetingLink;

      const updatedMentorship =
        await mentorship.save();

      // CREATE ACCEPT NOTIFICATION
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

      res.status(200).json(
        updatedMentorship
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
  sendMentorshipRequest,
  getMentorshipRequests,
  updateMentorshipStatus,
};