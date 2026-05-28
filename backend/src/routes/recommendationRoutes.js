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


// ==========================================
// GET AI RECOMMENDATIONS
// ==========================================
router.get(

  "/",

  protect,

  getRecommendedAlumni

);


// ==========================================
// GET RECOMMENDATIONS BY DOMAIN
// ==========================================
router.get(

  "/domain/:domain",

  protect,

  async (req, res) => {

    try {

      req.query.domain =
        req.params.domain;

      return getRecommendedAlumni(
        req,
        res
      );

    }

    catch (error) {

      console.log(
        "DOMAIN RECOMMENDATION ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  }

);


// ==========================================
// GET TOP MENTORS
// ==========================================
router.get(

  "/top-mentors",

  protect,

  async (req, res) => {

    try {

      req.query.sortBy =
        "trustScore";

      return getRecommendedAlumni(
        req,
        res
      );

    }

    catch (error) {

      console.log(
        "TOP MENTOR ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  }

);


// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports =
  router;