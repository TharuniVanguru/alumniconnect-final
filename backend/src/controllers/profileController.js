const Profile =
  require("../models/Profile");

const User =
  require("../models/User");


// ==========================================
// PROFILE COMPLETION CALCULATOR
// ==========================================
const calculateProfileCompletion =
  (profile) => {

    let completed = 0;

    const totalFields = 10;

    if (profile.name) completed++;

    if (profile.branch) completed++;

    if (profile.batch) completed++;

    if (profile.domain) completed++;

    if (profile.bio) completed++;

    if (
      profile.skills &&
      profile.skills.length > 0
    )
      completed++;

    if (profile.linkedinUrl)
      completed++;

    if (profile.githubUrl)
      completed++;

    if (profile.company)
      completed++;

    if (profile.profileImage)
      completed++;

    return Math.floor(

      (completed / totalFields) *
        100

    );

  };


// ==========================================
// PROFILE STRENGTH
// ==========================================
const getProfileStrength =
  (completion) => {

    if (completion >= 85)
      return "Excellent";

    if (completion >= 70)
      return "Strong";

    if (completion >= 50)
      return "Intermediate";

    return "Beginner";

  };


// ==========================================
// GET MY PROFILE
// ==========================================
const getMyProfile =
  async (req, res) => {

    try {

      let profile =
        await Profile.findOne({

          user:
            req.user._id,

        });


      // ====================================
      // AUTO CREATE PROFILE
      // ====================================
      if (!profile) {

        profile =
          await Profile.create({

            user:
              req.user._id,

            name:
              req.user.name || "",

            email:
              req.user.email || "",

            role:
              req.user.role || "",

            identifier:
              req.user.identifier || "",

          });

      }


      // ====================================
      // PROFILE ANALYTICS
      // ====================================
      const profileCompletion =

        calculateProfileCompletion(
          profile
        );

      const profileStrength =

        getProfileStrength(
          profileCompletion
        );


      // ====================================
      // UPDATE PROFILE STATUS
      // ====================================
      profile.profileCompleted =
        profileCompletion >= 60;

      await profile.save();


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        profile,

        analytics: {

          profileCompletion,

          profileStrength,

        },

      });

    }

    catch (error) {

      console.log(
        "GET PROFILE ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// UPDATE PROFILE
// ==========================================
const updateProfile =
  async (req, res) => {

    try {

      const profile =
        await Profile.findOne({

          user:
            req.user._id,

        });


      // ====================================
      // PROFILE NOT FOUND
      // ====================================
      if (!profile) {

        return res.status(404).json({

          success: false,

          message:
            "Profile not found",

        });

      }


      // ====================================
      // UPDATE FIELDS
      // ====================================
      const fields = [

        "name",
        "phone",
        "branch",
        "year",
        "batch",
        "cgpa",
        "domain",
        "skills",
        "interests",
        "linkedinUrl",
        "githubUrl",
        "portfolioUrl",
        "bio",
        "company",
        "jobRole",
        "experience",
        "profileImage",

      ];


      fields.forEach(
        (field) => {

          if (
            req.body[field] !==
            undefined
          ) {

            profile[field] =
              req.body[field];

          }

        }
      );


      // ====================================
      // BOOLEAN FIELD
      // ====================================
      if (

        req.body
          .mentorshipAvailable !==
        undefined

      ) {

        profile.mentorshipAvailable =

          req.body
            .mentorshipAvailable;

      }


      // ====================================
      // PROFILE ANALYTICS
      // ====================================
      const profileCompletion =

        calculateProfileCompletion(
          profile
        );

      const profileStrength =

        getProfileStrength(
          profileCompletion
        );


      // ====================================
      // UPDATE STATUS
      // ====================================
      profile.lastProfileUpdate =
        new Date();

      profile.profileCompleted =

        profileCompletion >= 60;


      // ====================================
      // SAVE PROFILE
      // ====================================
      const updatedProfile =
        await profile.save();


      // ====================================
      // UPDATE USER TABLE
      // ====================================
      await User.findByIdAndUpdate(

        req.user._id,

        {

          name:
            updatedProfile.name,

          profileImage:
            updatedProfile.profileImage,

        }

      );


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        message:
          "Profile updated successfully",

        profile:
          updatedProfile,

        analytics: {

          profileCompletion,

          profileStrength,

        },

      });

    }

    catch (error) {

      console.log(
        "UPDATE PROFILE ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// GET ALL ALUMNI
// ==========================================
const getAllAlumni =
  async (req, res) => {

    try {

      const alumni =
        await Profile.find({

          role: "alumni",

        }).select(

          `
          name
          email
          domain
          company
          jobRole
          mentorshipAvailable
          skills
          profileImage
          linkedinUrl
          experience
          `
        );


      res.status(200).json({

        success: true,

        total:
          alumni.length,

        alumni,

      });

    }

    catch (error) {

      console.log(
        "GET ALUMNI ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// GET PROFILE BY ID
// ==========================================
const getProfileById =
  async (req, res) => {

    try {

      const profile =
        await Profile.findById(
          req.params.id
        );


      if (!profile) {

        return res.status(404).json({

          success: false,

          message:
            "Profile not found",

        });

      }


      const profileCompletion =

        calculateProfileCompletion(
          profile
        );

      const profileStrength =

        getProfileStrength(
          profileCompletion
        );


      res.status(200).json({

        success: true,

        profile,

        analytics: {

          profileCompletion,

          profileStrength,

        },

      });

    }

    catch (error) {

      console.log(
        "GET PROFILE BY ID ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// GET CHAT USERS
// ==========================================
const getChatUsers =
  async (req, res) => {

    try {

      const currentUserId =
        req.user._id;


      const users =
        await User.find({

          _id: {

            $ne:
              currentUserId,

          },

          isActive: true,

        }).select(

          `
          name
          role
          email
          domain
          company
          jobRole
          isOnline
          profileImage
          `
        );


      res.status(200).json({

        success: true,

        total:
          users.length,

        users,

      });

    }

    catch (error) {

      console.log(
        "CHAT USERS ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// EXPORTS
// ==========================================
module.exports = {

  getMyProfile,

  updateProfile,

  getAllAlumni,

  getProfileById,

  getChatUsers,

};