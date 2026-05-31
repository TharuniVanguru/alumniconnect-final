const express =
  require("express");

const {

  getMyProfile,

  updateProfile,

  getProfileById,

  getAllAlumni,

  getChatUsers,

} = require(
  "../controllers/profileController"
);

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);

const User =
  require("../models/User");

const router =
  express.Router();


// ==========================================
// GET MY PROFILE
// ==========================================
router.get(

  "/me",

  protect,

  getMyProfile

);


// ==========================================
// UPDATE PROFILE
// ==========================================
router.put(

  "/update",

  protect,

  updateProfile

);


// ==========================================
// GET ALL ALUMNI
// ==========================================
router.get(

  "/alumni",

  protect,

  getAllAlumni

);


// ==========================================
// GET CHAT USERS
// ==========================================
router.get(

  "/chat-users",

  protect,

  getChatUsers

);


// ==========================================
// SEARCH USERS
// ==========================================
router.get(

  "/search/:keyword",

  protect,

  async (req, res) => {

    try {

      const keyword =
        req.params.keyword;

      // ====================================
      // SEARCH USERS
      // ====================================
      const users =
        await User.find({

          isActive: true,

          $or: [

            {

              name: {

                $regex:
                  keyword,

                $options:
                  "i",

              },

            },

            {

              domain: {

                $regex:
                  keyword,

                $options:
                  "i",

              },

            },

            {

              company: {

                $regex:
                  keyword,

                $options:
                  "i",

              },

            },

            {

              skills: {

                $elemMatch: {

                  $regex:
                    keyword,

                  $options:
                    "i",

                },

              },

            },

          ],

        }).select(

          `
          name
          email
          role
          domain
          company
          skills
          interests
          profileImage
          isOnline
          `
        );


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        count:
          users.length,

        users,

      });

    }

    catch (error) {

      console.log(
        "SEARCH USERS ERROR:",
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
// GET PROFILE BY ID
// ==========================================
router.get(

  "/:id",

  protect,

  getProfileById

);


// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports =
  router;