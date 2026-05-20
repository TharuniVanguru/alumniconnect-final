const express =
  require("express");

const {
  getRecommendations,
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
// GET AI RECOMMENDATIONS
// ==============================
router.get(
  "/",
  protect,
  getRecommendations
);


// EXPORT
module.exports =
  router;