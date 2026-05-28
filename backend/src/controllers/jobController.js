const Job =
  require("../models/Job");

const Notification =
  require("../models/Notification");


// ==========================================
// CREATE JOB
// ==========================================
const createJob =
  async (req, res) => {

    try {

      const {

        title,
        company,
        location,
        type,
        description,
        skillsRequired,
        salary,
        deadline,

      } = req.body;


      // ====================================
      // VALIDATION
      // ====================================
      if (

        !title ||
        !company ||
        !location ||
        !description

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please fill all required fields",

        });

      }


      // ====================================
      // ONLY ALUMNI / ADMIN
      // ====================================
      if (

        req.user.role !== "alumni" &&

        req.user.role !== "admin"

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Only alumni/admin can post jobs",

        });

      }


      // ====================================
      // CREATE JOB
      // ====================================
      const job =
        await Job.create({

          title,

          company,

          location,

          type:
            type || "Internship",

          description,

          skillsRequired:
            skillsRequired || [],

          salary:
            salary || "",

          deadline,

          postedBy:
            req.user._id,

          isActive:
            true,

        });


      // ====================================
      // RESPONSE
      // ====================================
      res.status(201).json({

        success: true,

        message:
          "Job posted successfully",

        job,

      });

    }

    catch (error) {

      console.log(
        "CREATE JOB ERROR:",
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
// GET ALL JOBS
// ==========================================
const getJobs =
  async (req, res) => {

    try {

      const {

        keyword,
        location,
        type,
        skill,

      } = req.query;


      const filters = {

        isActive: true,

      };


      if (location) {

        filters.location = {

          $regex: location,

          $options: "i",

        };

      }


      if (type) {

        filters.type = type;

      }


      if (skill) {

        filters.skillsRequired = {

          $in: [skill],

        };

      }


      if (keyword) {

        filters.$or = [

          {

            title: {

              $regex: keyword,

              $options: "i",

            },

          },

          {

            company: {

              $regex: keyword,

              $options: "i",

            },

          },

          {

            description: {

              $regex: keyword,

              $options: "i",

            },

          },

        ];

      }


      const jobs =
        await Job.find(filters)

          .populate(

            "postedBy",

            "name role"

          )

          .sort({

            createdAt: -1,

          });


      res.status(200).json({

        success: true,

        total:
          jobs.length,

        jobs,

      });

    }

    catch (error) {

      console.log(
        "GET JOBS ERROR:",
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
// GET SINGLE JOB
// ==========================================
const getSingleJob =
  async (req, res) => {

    try {

      const job =
        await Job.findById(
          req.params.id
        ).populate(

          "postedBy",

          "name email role"

        );


      if (!job) {

        return res.status(404).json({

          success: false,

          message:
            "Job not found",

        });

      }


      res.status(200).json({

        success: true,

        job,

      });

    }

    catch (error) {

      console.log(
        "GET SINGLE JOB ERROR:",
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
// UPDATE JOB
// ==========================================
const updateJob =
  async (req, res) => {

    try {

      const job =
        await Job.findById(
          req.params.id
        );


      if (!job) {

        return res.status(404).json({

          success: false,

          message:
            "Job not found",

        });

      }


      // ====================================
      // OWNER OR ADMIN
      // ====================================
      if (

        job.postedBy.toString() !==
          req.user._id.toString() &&

        req.user.role !== "admin"

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      const updatedJob =
        await Job.findByIdAndUpdate(

          req.params.id,

          req.body,

          {

            new: true,

          }

        );


      res.status(200).json({

        success: true,

        message:
          "Job updated successfully",

        job:
          updatedJob,

      });

    }

    catch (error) {

      console.log(
        "UPDATE JOB ERROR:",
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
// APPLY FOR JOB
// ==========================================
const applyJob =
  async (req, res) => {

    try {

      if (
        req.user.role !== "student"
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Only students can apply",

        });

      }


      const job =
        await Job.findById(
          req.params.id
        );


      if (!job) {

        return res.status(404).json({

          success: false,

          message:
            "Job not found",

        });

      }


      if (

        job.deadline &&

        new Date(job.deadline) <
          new Date()

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Application deadline passed",

        });

      }


      const alreadyApplied =

        job.applications.find(

          (app) =>

            app.student.toString() ===

            req.user._id.toString()

        );


      if (alreadyApplied) {

        return res.status(400).json({

          success: false,

          message:
            "Already applied for this job",

        });

      }


      job.applications.push({

        student:
          req.user._id,

        studentName:
          req.user.name,

        studentEmail:
          req.user.email,

      });


      await job.save();


      await Notification.create({

        recipient:
          job.postedBy,

        sender:
          req.user._id,

        title:
          "New Job Application",

        message:
          `${req.user.name} applied for ${job.title}`,

        type:
          "job",

        relatedId:
          job._id,

      });


      res.status(200).json({

        success: true,

        message:
          "Applied successfully",

      });

    }

    catch (error) {

      console.log(
        "APPLY JOB ERROR:",
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
// GET JOB APPLICATIONS
// ==========================================
const getJobApplications =
  async (req, res) => {

    try {

      const job =
        await Job.findById(
          req.params.id
        ).populate(

          "applications.student",

          "name email role"

        );


      if (!job) {

        return res.status(404).json({

          success: false,

          message:
            "Job not found",

        });

      }


      if (

        job.postedBy.toString() !==

          req.user._id.toString() &&

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
          job.applications.length,

        applications:
          job.applications,

      });

    }

    catch (error) {

      console.log(
        "GET APPLICATIONS ERROR:",
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
// DELETE JOB
// ==========================================
const deleteJob =
  async (req, res) => {

    try {

      const job =
        await Job.findById(
          req.params.id
        );


      if (!job) {

        return res.status(404).json({

          success: false,

          message:
            "Job not found",

        });

      }


      if (

        job.postedBy.toString() !==

          req.user._id.toString() &&

        req.user.role !== "admin"

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      await job.deleteOne();


      res.status(200).json({

        success: true,

        message:
          "Job deleted successfully",

      });

    }

    catch (error) {

      console.log(
        "DELETE JOB ERROR:",
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
// GET MY POSTED JOBS
// ==========================================
const getMyPostedJobs =
  async (req, res) => {

    try {

      const jobs =
        await Job.find({

          postedBy:
            req.user._id,

        }).sort({

          createdAt: -1,

        });


      res.status(200).json({

        success: true,

        total:
          jobs.length,

        jobs,

      });

    }

    catch (error) {

      console.log(
        "MY JOBS ERROR:",
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

  createJob,

  getJobs,

  getSingleJob,

  updateJob,

  applyJob,

  getJobApplications,

  deleteJob,

  getMyPostedJobs,

};