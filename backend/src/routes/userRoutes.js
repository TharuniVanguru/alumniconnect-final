const express =
  require("express");

const User =
  require("../models/User");

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


// ==========================================
// SEARCH USERS
// ==========================================
router.get(

  "/search",

  protect,

  async (req, res) => {

    try {

      const q =
        req.query.q || "";


      const users =
        await User.find({

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

            {

              interests: {

                $elemMatch: {

                  $regex: q,

                  $options: "i",

                },

              },

            },

            {

              companyName: {

                $regex: q,

                $options: "i",

              },

            },

          ],

          isActive: true,

        })

        .select("-password")

        .limit(20);


      res.status(200).json({

        success: true,

        total:
          users.length,

        users,

      });

    }

    catch (error) {

      console.log(
        "SEARCH USER ERROR:",
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
// FILTER USERS
// ==========================================
router.get(

  "/filter",

  protect,

  async (req, res) => {

    try {

      const {

        domain,

        role,

        skill,

      } = req.query;


      const filters = {

        isActive: true,

      };


      if (domain) {

        filters.domain = {

          $regex: domain,

          $options: "i",

        };

      }


      if (role) {

        filters.role = role;

      }


      if (skill) {

        filters.skills = {

          $in: [skill],

        };

      }


      const users =
        await User.find(filters)

          .select("-password")

          .sort({

            trustScore: -1,

          });


      res.status(200).json({

        success: true,

        total:
          users.length,

        users,

      });

    }

    catch (error) {

      console.log(
        "FILTER USER ERROR:",
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
// GET USER BY ID
// ==========================================
router.get(

  "/:id",

  protect,

  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        ).select("-password");


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      res.status(200).json({

        success: true,

        user,

      });

    }

    catch (error) {

      console.log(
        "GET USER ERROR:",
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
// GET ONLINE USERS
// ==========================================
router.get(

  "/",

  protect,

  async (req, res) => {

    try {

      const users =
        await User.find({

          isActive: true,

        })

        .select(

          `
          name
          role
          email
          domain
          companyName
          isOnline
          trustScore
          profileImage
          `

        )

        .sort({

          isOnline: -1,

          trustScore: -1,

        });


      res.status(200).json({

        success: true,

        total:
          users.length,

        users,

      });

    }

    catch (error) {

      console.log(
        "GET USERS ERROR:",
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