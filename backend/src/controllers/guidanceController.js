const GuidanceRequest =
  require(
    "../models/GuidanceRequest"
  );

const Notification =
  require(
    "../models/Notification"
  );


// =========================
// CREATE REQUEST
// =========================
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
      } = req.body;


      // VALIDATION
      if (
        !alumniId ||
        !domain ||
        !topic ||
        !description
      ) {

        return res.status(400).json({

          message:
            "Please fill all required fields",

        });

      }


      // CREATE REQUEST
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

          urgency,

        });


      // CREATE NOTIFICATION
      await Notification.create({

        recipient:
          alumniId,

        title:
          "New Guidance Request",

        message:
          `${req.user.name} sent you a guidance request on ${topic}`,

        type:
          "guidance",

      });


      res.status(201).json(
        request
      );

    }

    catch (error) {

      console.log(
        "CREATE REQUEST ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Server Error",

      });

    }

  };


// =========================
// GET ALUMNI REQUESTS
// =========================
const getMyRequests =
  async (req, res) => {

    try {

      const requests =
        await GuidanceRequest.find({

          alumniId:
            req.user._id,

        }).sort({

          createdAt: -1,

        });


      res.status(200).json(
        requests
      );

    }

    catch (error) {

      console.log(
        "GET REQUESTS ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Server Error",

      });

    }

  };


// =========================
// GET STUDENT REQUESTS
// =========================
const getStudentRequests =
  async (req, res) => {

    try {

      const requests =
        await GuidanceRequest.find({

          studentId:
            req.user._id,

        }).sort({

          createdAt: -1,

        });


      res.status(200).json(
        requests
      );

    }

    catch (error) {

      console.log(
        "GET STUDENT REQUESTS ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Server Error",

      });

    }

  };


// =========================
// UPDATE STATUS
// =========================
const updateStatus =
  async (req, res) => {

    try {

      const request =
        await GuidanceRequest.findById(
          req.params.id
        );


      if (!request) {

        return res.status(404).json({

          message:
            "Request not found",

        });

      }


      // ONLY ACCEPTED / REJECTED
      if (
        ![
          "Accepted",
          "Rejected",
          "Pending",
        ].includes(
          req.body.status
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid status",

        });

      }


      request.status =
        req.body.status;


      const updated =
        await request.save();


      // CREATE NOTIFICATION FOR STUDENT
      await Notification.create({

        recipient:
          request.studentId,

        title:
          "Guidance Request Updated",

        message:
          `Your guidance request has been ${req.body.status}`,

        type:
          "guidance",

      });


      res.status(200).json(
        updated
      );

    }

    catch (error) {

      console.log(
        "UPDATE STATUS ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Server Error",

      });

    }

  };


// =========================
// EXPORTS
// =========================
module.exports = {

  createRequest,

  getMyRequests,

  getStudentRequests,

  updateStatus,

};