const express =
  require("express");

const {

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
// GET ALL JOBS
// GET /api/jobs
// ==========================================
router.get(
  "/",
  getJobs
);


// ==========================================
// GET TRENDING JOBS
// GET /api/jobs/trending
// IMPORTANT:
// KEEP ABOVE /:id
// ==========================================
router.get(
  "/trending",
  getTrendingJobs
);


// ==========================================
// GET MY POSTED JOBS
// GET /api/jobs/my-jobs
// ==========================================
router.get(

  "/my-jobs",

  protect,

  getMyPostedJobs

);


// ==========================================
// GET SINGLE JOB
// GET /api/jobs/:id
// ==========================================
router.get(

  "/:id",

  getSingleJob

);


// ==========================================
// CREATE JOB
// POST /api/jobs
// ==========================================
router.post(

  "/",

  protect,

  createJob

);


// ==========================================
// UPDATE JOB
// PUT /api/jobs/:id
// ==========================================
router.put(

  "/:id",

  protect,

  updateJob

);


// ==========================================
// APPLY FOR JOB
// POST /api/jobs/:id/apply
// ==========================================
router.post(

  "/:id/apply",

  protect,

  applyJob

);


// ==========================================
// SAVE / UNSAVE JOB
// POST /api/jobs/:id/save
// ==========================================
router.post(

  "/:id/save",

  protect,

  saveJob

);


// ==========================================
// GET JOB APPLICATIONS
// GET /api/jobs/:id/applications
// ==========================================
router.get(

  "/:id/applications",

  protect,

  getJobApplications

);


// ==========================================
// DELETE JOB
// DELETE /api/jobs/:id
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