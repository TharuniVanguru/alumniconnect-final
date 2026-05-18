const express =
  require("express");

const Profile =
  require("../models/Profile");

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


// =========================
// SEARCH USERS
// =========================
router.get(
  "/search",
  protect,
  async (req, res) => {

    try {

      const q =
        req.query.q || "";

      const users =
        await Profile.find({

          $or: [

            {
              name: {
                $regex: q,
                $options: "i",
              },
            },

            {
              domain: {
                $regex: q,
                $options: "i",
              },
            },

            {
              skills: {
                $elemMatch: {
                  $regex: q,
                  $options: "i",
                },
              },
            },

          ],

        });

      res.status(200).json(
        users
      );

    }

    catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }

  }
);


// =========================
// FILTER USERS
// =========================
router.get(
  "/filter",
  protect,
  async (req, res) => {

    try {

      const domain =
        req.query.domain || "";

      const users =
        await Profile.find({

          domain: {
            $regex: domain,
            $options: "i",
          },

        });

      res.status(200).json(
        users
      );

    }

    catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }

  }
);


module.exports =
  router;