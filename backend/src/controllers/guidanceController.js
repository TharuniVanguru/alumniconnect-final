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
            "Similar request already exists",

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

          alumniName:
            alumniName ||
            alumni.name,

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

        sender:
          req.user._id,

        title:
          "New Guidance Request",

        message:
          `${req.user.name} sent guidance request on ${topic}`,

        type:
          "guidance",

        priority:

          urgency
            ? urgency.toLowerCase()
            : "medium",

        relatedId:
          request._id,

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

        rejected:
          requests.filter(

            (r) =>
              r.status ===
              "Rejected"

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

      console.log(
        "GET SINGLE REQUEST ERROR:",
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
// UPDATE STATUS
// ==========================================
const updateStatus =
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
      // AUTHORIZATION
      // ====================================
      if (

        request.alumniId.toString() !==
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
      // UPDATE
      // ====================================
      Object.assign(

        request,

        req.body

      );


      if (
        req.body.status ===
        "Completed"
      ) {

        request.completedAt =
          new Date();

      }


      const updatedRequest =
        await request.save();


      // ====================================
      // NOTIFICATION
      // ====================================
      await Notification.create({

        recipient:
          request.studentId,

        sender:
          req.user._id,

        title:
          "Guidance Request Updated",

        message:
          `Guidance request marked as ${request.status}`,

        type:
          "guidance",

      });


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
// SUBMIT FEEDBACK
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


      await request.save();


      res.status(200).json({

        success: true,

        message:
          "Feedback submitted successfully",

        request,

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
// DELETE REQUEST
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

      console.log(
        "DELETE REQUEST ERROR:",
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

        completed:
          requests.filter(

            (r) =>
              r.status ===
              "Completed"

          ).length,

        rejected:
          requests.filter(

            (r) =>
              r.status ===
              "Rejected"

          ).length,

      };


      res.status(200).json({

        success: true,

        stats,

      });

    }

    catch (error) {

      console.log(
        "GUIDANCE STATS ERROR:",
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

  createRequest,

  getMyRequests,

  getStudentRequests,

  getSingleRequest,

  updateStatus,

  submitGuidanceFeedback,

  deleteGuidanceRequest,

  getGuidanceStats,

};