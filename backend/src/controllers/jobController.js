const Job = require("../models/Job");


// @desc    Create Job
// @route   POST /jobs
// @access  Alumni/Admin

const createJob = async (req, res) => {

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

    // CHECK ROLE
    if (
      req.user.role !== "alumni" &&
      req.user.role !== "admin"
    ) {

      return res.status(403).json({
        message:
          "Only alumni/admin can post jobs",
      });

    }

    const job = await Job.create({
      title,
      company,
      location,
      type,
      description,
      skillsRequired,
      salary,
      deadline,
      postedBy: req.user._id,
    });

    res.status(201).json(job);

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


// @desc    Get All Jobs
// @route   GET /jobs
// @access  Private

const getJobs = async (req, res) => {

  try {

    const jobs = await Job.find({
      isActive: true,
    })
      .populate(
        "postedBy",
        "name role"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json(jobs);

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


// @desc    Apply For Job
// @route   POST /jobs/:id/apply
// @access  Student

const applyJob = async (req, res) => {

  try {

    // ONLY STUDENTS
    if (req.user.role !== "student") {

      return res.status(403).json({
        message:
          "Only students can apply",
      });

    }

    const job = await Job.findById(
      req.params.id
    );

    if (!job) {

      return res.status(404).json({
        message: "Job not found",
      });

    }

    // CHECK ALREADY APPLIED
    const alreadyApplied =
      job.applications.find(
        (app) =>
          app.student.toString() ===
          req.user._id.toString()
      );

    if (alreadyApplied) {

      return res.status(400).json({
        message:
          "Already applied for this job",
      });

    }

    // ADD APPLICATION
    job.applications.push({
      student: req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email,
    });

    await job.save();

    res.status(200).json({
      message:
        "Applied successfully",
    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


// @desc    Get Job Applications
// @route   GET /jobs/:id/applications
// @access  Alumni/Admin

const getJobApplications = async (
  req,
  res
) => {

  try {

    const job = await Job.findById(
      req.params.id
    ).populate(
      "applications.student",
      "name email role"
    );

    if (!job) {

      return res.status(404).json({
        message: "Job not found",
      });

    }

    // ONLY OWNER OR ADMIN
    if (
      job.postedBy.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {

      return res.status(403).json({
        message:
          "Not authorized",
      });

    }

    res.status(200).json(
      job.applications
    );

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


// @desc    Delete Job
// @route   DELETE /jobs/:id
// @access  Alumni/Admin

const deleteJob = async (req, res) => {

  try {

    const job = await Job.findById(
      req.params.id
    );

    if (!job) {

      return res.status(404).json({
        message: "Job not found",
      });

    }

    // OWNER OR ADMIN
    if (
      job.postedBy.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {

      return res.status(403).json({
        message:
          "Not authorized",
      });

    }

    await job.deleteOne();

    res.status(200).json({
      message:
        "Job deleted successfully",
    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


module.exports = {
  createJob,
  getJobs,
  applyJob,
  getJobApplications,
  deleteJob,
};