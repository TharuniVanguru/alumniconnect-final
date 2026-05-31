const Job =
  require("../models/Job");

const Notification =
  require("../models/Notification");

const mongoose =
  require("mongoose");


// ==========================================
// CREATE JOB
// ==========================================
const createJob =
  async (req, res) => {

    try {

      const {

        title,
        company,
        companyLogo,
        location,
        type,
        experienceLevel,
        description,
        responsibilities,
        skillsRequired,
        preferredSkills,
        eligibility,
        experienceRequired,
        salary,
        applyLink,
        deadline,
        isFeatured,

      } = req.body;


      // ====================================
      // VALIDATION
      // ====================================
      if (

        !title?.trim() ||
        !company?.trim() ||
        !location?.trim() ||
        !description?.trim()

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

          title:
            title.trim(),

          company:
            company.trim(),

          companyLogo:
            companyLogo || "",

          location:
            location.trim(),

          type:
            type || "Internship",

          experienceLevel:
            experienceLevel || "Fresher",

          description:
            description.trim(),

          responsibilities:

            Array.isArray(
              responsibilities
            )

              ? responsibilities

              : [],

          skillsRequired:

            Array.isArray(
              skillsRequired
            )

              ? skillsRequired.map(

                  (skill) =>

                    skill.toLowerCase().trim()

                )

              : [],

          preferredSkills:

            Array.isArray(
              preferredSkills
            )

              ? preferredSkills.map(

                  (skill) =>

                    skill.toLowerCase().trim()

                )

              : [],

          eligibility:
            eligibility || "",

          experienceRequired:
            experienceRequired || "",

          salary:
            salary || "",

          applyLink:
            applyLink || "",

          deadline:
            deadline || null,

          postedBy:
            req.user._id,

          postedByName:
            req.user.name,

          isFeatured:
            isFeatured || false,

          isActive:
            true,

        });


      return res.status(201).json({

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

      return res.status(500).json({

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
        company,
        featured,

      } = req.query;


      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 10;

      const skip =
        (page - 1) * limit;


      // ====================================
      // FILTERS
      // ====================================
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


      if (company) {

        filters.company = {

          $regex: company,

          $options: "i",

        };

      }


      if (featured === "true") {

        filters.isFeatured =
          true;

      }


      if (skill) {

        filters.skillsRequired = {

          $in: [

            skill.toLowerCase(),

          ],

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


      // ====================================
      // FETCH JOBS
      // ====================================
      const jobs =
        await Job.find(filters)

          .populate(

            "postedBy",

            "name role profileImage"

          )

          .sort({

            isFeatured: -1,

            createdAt: -1,

          })

          .skip(skip)

          .limit(limit);


      const total =
        await Job.countDocuments(
          filters
        );


      return res.status(200).json({

        success: true,

        total,

        currentPage:
          page,

        totalPages:
          Math.ceil(
            total / limit
          ),

        jobs,

      });

    }

    catch (error) {

      console.log(
        "GET JOBS ERROR:",
        error
      );

      return res.status(500).json({

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
        )

          .populate(

            "postedBy",

            "name email role profileImage"

          );

      if (!job) {

        return res.status(404).json({

          success: false,

          message:
            "Job not found",

        });

      }


      // ====================================
      // INCREMENT VIEW
      // ====================================
      job.views += 1;

      await job.save();


      return res.status(200).json({

        success: true,

        job,

      });

    }

    catch (error) {

      console.log(
        "GET SINGLE JOB ERROR:",
        error
      );

      return res.status(500).json({

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

            runValidators: true,

          }

        );


      return res.status(200).json({

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

      return res.status(500).json({

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

        job.hasApplied(
          req.user._id
        );

      if (alreadyApplied) {

        return res.status(400).json({

          success: false,

          message:
            "Already applied for this job",

        });

      }


      // ====================================
      // ADD APPLICATION
      // ====================================
      job.applications.push({

        student:
          req.user._id,

        studentName:
          req.user.name,

        studentEmail:
          req.user.email,

        resumeUrl:
          req.user.resumeUrl || "",

        coverLetter:
          req.body.coverLetter || "",

        atsScore:
          Math.floor(
            Math.random() * 30
          ) + 70,

      });


      job.clicks += 1;

      await job.save();


      // ====================================
      // CREATE NOTIFICATION
      // ====================================
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


      return res.status(200).json({

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

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// SAVE JOB
// ==========================================
const saveJob =
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


      const alreadySaved =

        job.savedBy.some(

          (id) =>

            id.toString() ===

            req.user._id.toString()

        );


      if (alreadySaved) {

        job.savedBy =
          job.savedBy.filter(

            (id) =>

              id.toString() !==

              req.user._id.toString()

          );

      }

      else {

        job.savedBy.push(
          req.user._id
        );

      }


      await job.save();


      return res.status(200).json({

        success: true,

        saved:
          !alreadySaved,

        totalSaved:
          job.savedBy.length,

      });

    }

    catch (error) {

      console.log(
        "SAVE JOB ERROR:",
        error
      );

      return res.status(500).json({

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

          "name email role profileImage skills"

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


      return res.status(200).json({

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

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// GET TRENDING JOBS
// ==========================================
const getTrendingJobs =
  async (req, res) => {

    try {

      const jobs =
        await Job.find({

          isActive: true,

        })

          .sort({

            views: -1,

            totalApplications:
              -1,

          })

          .limit(10);


      return res.status(200).json({

        success: true,

        jobs,

      });

    }

    catch (error) {

      console.log(
        "TRENDING JOB ERROR:",
        error
      );

      return res.status(500).json({

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


      // ====================================
      // ANALYTICS
      // ====================================
      const totalApplications =

        jobs.reduce(

          (acc, job) =>

            acc +
            job.totalApplications,

          0

        );


      return res.status(200).json({

        success: true,

        total:
          jobs.length,

        totalApplications,

        jobs,

      });

    }

    catch (error) {

      console.log(
        "MY JOBS ERROR:",
        error
      );

      return res.status(500).json({

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


      return res.status(200).json({

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

      return res.status(500).json({

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

  saveJob,

  getJobApplications,

  getTrendingJobs,

  deleteJob,

  getMyPostedJobs,

};