const express =
  require("express");

const {

  createJob,

  getJobs,

  getSingleJob,

  updateJob,

  applyJob,

  getJobApplications,

  deleteJob,

} = require(
  "../controllers/jobController"
);

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


// ==========================================
// CREATE JOB
// ==========================================
router.post(
  "/",
  protect,
  createJob
);


// ==========================================
// GET ALL JOBS
// ==========================================
router.get(
  "/",
  protect,
  getJobs
);


// ==========================================
// GET SINGLE JOB
// ==========================================
router.get(
  "/:id",
  protect,
  getSingleJob
);


// ==========================================
// UPDATE JOB
// ==========================================
router.put(
  "/:id",
  protect,
  updateJob
);


// ==========================================
// APPLY FOR JOB
// ==========================================
router.post(
  "/:id/apply",
  protect,
  applyJob
);


// ==========================================
// GET JOB APPLICATIONS
// ==========================================
router.get(
  "/:id/applications",
  protect,
  getJobApplications
);


// ==========================================
// DELETE JOB
// ==========================================
router.delete(
  "/:id",
  protect,
  deleteJob
);


// ==========================================
// EXPORT
// ==========================================
module.exports =
  router;