const GuidanceRequest =
  require(
    "../models/GuidanceRequest"
  );

const Notification =
  require(
    "../models/Notification"
  );

const User =
  require(
    "../models/User"
  );


// ==========================================
// CREATE GUIDANCE REQUEST
// ==========================================
const createRequest =
  async (req, res) => {

    try {

      const {

        alumniId,
        alumniName,
        domain,
        topic,
        description,
        urgency,
        category,

      } = req.body;


      // ====================================
      // VALIDATION
      // ====================================
      if (

        !alumniId ||
        !domain ||
        !topic ||
        !description

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please fill all required fields",

        });

      }


      // ====================================
      // DUPLICATE CHECK
      // ====================================
      const existingRequest =
        await GuidanceRequest.findOne({

          studentId:
            req.user._id,

          alumniId,

          topic,

          status:
            "Pending",

        });

      if (existingRequest) {

        return res.status(400).json({

          success: false,

          message:
            "You already sent a similar request",

        });

      }


      // ====================================
      // CREATE REQUEST
      // ====================================
      const request =
        await GuidanceRequest.create({

          studentId:
            req.user._id,

          studentName:
            req.user.name,

          alumniId,

          alumniName,

          domain,

          topic,

          description,

          urgency:
            urgency || "Medium",

          category:
            category || "General",

          status:
            "Pending",

        });


      // ====================================
      // CREATE NOTIFICATION
      // ====================================
      await Notification.create({

        recipient:
          alumniId,

        title:
          "New Guidance Request",

        message:
          `${req.user.name} sent you a guidance request on ${topic}`,

        type:
          "guidance",

        priority:
          urgency || "Medium",

      });


      // ====================================
      // RESPONSE
      // ====================================
      res.status(201).json({

        success: true,

        message:
          "Guidance request created successfully",

        request,

      });

    }

    catch (error) {

      console.log(
        "CREATE REQUEST ERROR:",
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
// GET ALUMNI REQUESTS
// ==========================================
const getMyRequests =
  async (req, res) => {

    try {

      const requests =
        await GuidanceRequest.find({

          alumniId:
            req.user._id,

        })

        .sort({

          createdAt: -1,

        });


      // ====================================
      // ANALYTICS
      // ====================================
      const analytics = {

        total:
          requests.length,

        pending:
          requests.filter(

            (r) =>
              r.status ===
              "Pending"

          ).length,

        accepted:
          requests.filter(

            (r) =>
              r.status ===
              "Accepted"

          ).length,

        completed:
          requests.filter(

            (r) =>
              r.status ===
              "Completed"

          ).length,

        highPriority:
          requests.filter(

            (r) =>
              r.urgency ===
              "High"

          ).length,

      };


      res.status(200).json({

        success: true,

        analytics,

        requests,

      });

    }

    catch (error) {

      console.log(
        "GET REQUESTS ERROR:",
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
// GET STUDENT REQUESTS
// ==========================================
const getStudentRequests =
  async (req, res) => {

    try {

      const requests =
        await GuidanceRequest.find({

          studentId:
            req.user._id,

        })

        .sort({

          createdAt: -1,

        });


      res.status(200).json({

        success: true,

        total:
          requests.length,

        requests,

      });

    }

    catch (error) {

      console.log(
        "GET STUDENT REQUESTS ERROR:",
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
// GET SINGLE REQUEST
// ==========================================
const getSingleRequest =
  async (req, res) => {

    try {

      const request =
        await GuidanceRequest.findById(
          req.params.id
        );

      if (!request) {

        return res.status(404).json({

          success: false,

          message:
            "Request not found",

        });

      }


      // ====================================
      // ACCESS CONTROL
      // ====================================
      const isAllowed =

        request.studentId.toString() ===
          req.user._id.toString()

        ||

        request.alumniId.toString() ===
          req.user._id.toString()

        ||

        req.user.role === "admin";


      if (!isAllowed) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      res.status(200).json({

        success: true,

        request,

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
// UPDATE GUIDANCE STATUS
// ==========================================
const updateStatus =
  async (req, res) => {

    try {

      const request =
        await GuidanceRequest.findById(
          req.params.id
        );


      // ====================================
      // REQUEST CHECK
      // ====================================
      if (!request) {

        return res.status(404).json({

          success: false,

          message:
            "Request not found",

        });

      }


      // ====================================
      // VALID STATUSES
      // ====================================
      const validStatuses = [

        "Pending",

        "Accepted",

        "Rejected",

        "Completed",

      ];


      if (

        req.body.status &&

        !validStatuses.includes(
          req.body.status
        )

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid status",

        });

      }


      // ====================================
      // RESPONSE TIME
      // ====================================
      if (
        req.body.status ===
        "Accepted"
      ) {

        request.responseTime =
          Math.floor(

            (
              new Date() -
              new Date(
                request.createdAt
              )
            ) /

            (1000 * 60)

          );

      }


      // ====================================
      // UPDATE FIELDS
      // ====================================
      if (req.body.status) {

        request.status =
          req.body.status;

      }

      if (req.body.meetingLink) {

        request.meetingLink =
          req.body.meetingLink;

      }

      if (req.body.scheduledDate) {

        request.scheduledDate =
          req.body.scheduledDate;

      }

      if (req.body.feedback) {

        request.feedback =
          req.body.feedback;

      }

      if (req.body.sessionNotes) {

        request.sessionNotes =
          req.body.sessionNotes;

      }

      if (req.body.rating) {

        request.rating =
          req.body.rating;


        // ==================================
        // UPDATE TRUST SCORE
        // ==================================
        const alumni =
          await User.findById(
            request.alumniId
          );

        if (alumni) {

          alumni.trustScore =
            Math.min(

              100,

              (alumni.trustScore || 40)

              +

              req.body.rating

            );

          await alumni.save();

        }

      }


      // ====================================
      // COMPLETED
      // ====================================
      if (
        req.body.status ===
        "Completed"
      ) {

        request.completedAt =
          new Date();

      }


      // ====================================
      // SAVE
      // ====================================
      const updatedRequest =
        await request.save();


      // ====================================
      // NOTIFICATION MESSAGE
      // ====================================
      let notificationMessage =

        `Your guidance request status changed to ${request.status}`;


      if (
        req.body.status ===
        "Accepted"
      ) {

        notificationMessage =
          `${req.user.name} accepted your guidance request`;

      }

      if (
        req.body.status ===
        "Rejected"
      ) {

        notificationMessage =
          `${req.user.name} rejected your guidance request`;

      }

      if (
        req.body.status ===
        "Completed"
      ) {

        notificationMessage =
          `${req.user.name} marked guidance session as completed`;

      }


      // ====================================
      // CREATE NOTIFICATION
      // ====================================
      await Notification.create({

        recipient:
          request.studentId,

        title:
          "Guidance Request Updated",

        message:
          notificationMessage,

        type:
          "guidance",

      });


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        message:
          "Guidance request updated successfully",

        request:
          updatedRequest,

      });

    }

    catch (error) {

      console.log(
        "UPDATE STATUS ERROR:",
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
// SUBMIT GUIDANCE FEEDBACK
// ==========================================
const submitGuidanceFeedback =
  async (req, res) => {

    try {

      const request =
        await GuidanceRequest.findById(
          req.params.id
        );

      if (!request) {

        return res.status(404).json({

          success: false,

          message:
            "Request not found",

        });

      }


      // ====================================
      // ONLY STUDENT
      // ====================================
      if (

        request.studentId.toString() !==
          req.user._id.toString()

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      request.feedback =
        req.body.feedback || "";

      request.rating =
        req.body.rating || 0;

      request.status =
        "Completed";

      request.completedAt =
        new Date();


      // ====================================
      // UPDATE ALUMNI TRUST SCORE
      // ====================================
      const alumni =
        await User.findById(
          request.alumniId
        );

      if (alumni && req.body.rating) {

        alumni.trustScore =
          Math.min(

            100,

            (alumni.trustScore || 40)

            +

            req.body.rating

          );

        await alumni.save();

      }


      await request.save();


      res.status(200).json({

        success: true,

        message:
          "Feedback submitted successfully",

        request,

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
// DELETE GUIDANCE REQUEST
// ==========================================
const deleteGuidanceRequest =
  async (req, res) => {

    try {

      const request =
        await GuidanceRequest.findById(
          req.params.id
        );

      if (!request) {

        return res.status(404).json({

          success: false,

          message:
            "Request not found",

        });

      }


      // ====================================
      // OWNER OR ADMIN
      // ====================================
      if (

        request.studentId.toString() !==
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


      await request.deleteOne();


      res.status(200).json({

        success: true,

        message:
          "Guidance request deleted successfully",

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
// GUIDANCE STATS
// ==========================================
const getGuidanceStats =
  async (req, res) => {

    try {

      const requests =
        await GuidanceRequest.find({

          alumniId:
            req.user._id,

        });


      const stats = {

        total:
          requests.length,

        pending:
          requests.filter(

            (r) =>
              r.status ===
              "Pending"

          ).length,

        accepted:
          requests.filter(

            (r) =>
              r.status ===
              "Accepted"

          ).length,

        rejected:
          requests.filter(

            (r) =>
              r.status ===
              "Rejected"

          ).length,

        completed:
          requests.filter(

            (r) =>
              r.status ===
              "Completed"

          ).length,

        highPriority:
          requests.filter(

            (r) =>
              r.urgency ===
              "High"

          ).length,

      };


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

  createRequest,

  getMyRequests,

  getStudentRequests,

  getSingleRequest,

  updateStatus,

  submitGuidanceFeedback,

  deleteGuidanceRequest,

  getGuidanceStats,

};