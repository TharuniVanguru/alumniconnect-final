const express = require("express");

const {
  createJob,
  getJobs,
  applyJob,
  getJobApplications,
  deleteJob,
} = require("../controllers/jobController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE JOB
router.post(
  "/",
  protect,
  createJob
);


// GET ALL JOBS
router.get(
  "/",
  protect,
  getJobs
);


// APPLY FOR JOB
router.post(
  "/:id/apply",
  protect,
  applyJob
);


// GET JOB APPLICATIONS
router.get(
  "/:id/applications",
  protect,
  getJobApplications
);


// DELETE JOB
router.delete(
  "/:id",
  protect,
  deleteJob
);


module.exports = router;