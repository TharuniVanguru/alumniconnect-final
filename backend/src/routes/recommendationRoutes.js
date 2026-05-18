const express =
  require("express");

const {
  getRecommendedAlumni,
} = require(
  "../controllers/recommendationController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


// ==============================
// GET RECOMMENDATIONS
// ==============================
router.get(
  "/",
  protect,
  getRecommendedAlumni
);


// EXPORT
module.exports =
  router;