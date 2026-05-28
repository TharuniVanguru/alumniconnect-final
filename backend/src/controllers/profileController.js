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

    const totalFields = 12;

    if (profile.name) completed++;
    if (profile.branch) completed++;
    if (profile.domain) completed++;
    if (profile.bio) completed++;
    if (profile.skills?.length > 0) completed++;
    if (profile.interests?.length > 0) completed++;
    if (profile.linkedinUrl) completed++;
    if (profile.githubUrl) completed++;
    if (profile.portfolioUrl) completed++;
    if (profile.company) completed++;
    if (profile.jobRole) completed++;
    if (profile.experience) completed++;

    return Math.floor(

      (completed / totalFields) * 100

    );

  };


// ==========================================
// TRUST SCORE CALCULATOR
// ==========================================
const calculateTrustScore =
  (profile) => {

    let score = 40;


    // VERIFIED LINKS
    if (profile.linkedinUrl)
      score += 20;

    if (profile.githubUrl)
      score += 10;

    if (profile.portfolioUrl)
      score += 10;


    // PROFILE DETAILS
    if (profile.bio)
      score += 10;

    if (
      profile.skills?.length > 0
    )
      score += 10;


    // EXPERIENCE BONUS
    if (

      profile.company ||

      profile.jobRole

    )
      score += 10;


    return Math.min(
      score,
      100
    );

  };


// ==========================================
// PROFILE STRENGTH
// ==========================================
const getProfileStrength =
  (
    completion,
    trustScore
  ) => {

    const total =

      (
        completion +
        trustScore
      ) / 2;


    if (total >= 85)
      return "Excellent";

    if (total >= 70)
      return "Strong";

    if (total >= 50)
      return "Good";

    return "Needs Improvement";

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
              req.user.name,

            email:
              req.user.email,

            role:
              req.user.role,

            identifier:
              req.user.identifier,

            branch:
              req.user.branch || "",

            batch:
              req.user.batch || "",

            domain:
              req.user.domain || "",

            bio:
              req.user.bio || "",

            skills:
              req.user.skills || [],

            interests:
              req.user.interests || [],

            linkedinUrl:
              req.user.linkedinUrl || "",

            githubUrl:
              req.user.githubUrl || "",

            portfolioUrl:
              req.user.portfolioUrl || "",

            company:
              req.user.companyName || "",

            experience:
              req.user.experience || "",

            profileCompleted:
              false,

            trustScore:
              40,

          });

      }


      // ====================================
      // PROFILE ANALYTICS
      // ====================================
      const profileCompletion =

        calculateProfileCompletion(
          profile
        );

      const trustScore =

        calculateTrustScore(
          profile
        );

      const profileStrength =

        getProfileStrength(

          profileCompletion,

          trustScore

        );


      // ====================================
      // QUARTERLY REMINDER
      // ====================================
      let needsProfileUpdate =
        false;


      if (
        profile.lastProfileUpdate
      ) {

        const diffDays =
          Math.floor(

            (
              new Date() -

              new Date(
                profile.lastProfileUpdate
              )

            ) /

            (1000 * 60 * 60 * 24)

          );


        if (diffDays > 90) {

          needsProfileUpdate =
            true;

        }

      }


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        profile,

        analytics: {

          profileCompletion,

          trustScore,

          profileStrength,

          needsProfileUpdate,

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


      if (!profile) {

        return res.status(404).json({

          success: false,

          message:
            "Profile not found",

        });

      }


      // ====================================
      // UPDATE PROFILE FIELDS
      // ====================================
      const fields = [

        "name",
        "branch",
        "year",
        "batch",
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

      const trustScore =

        calculateTrustScore(
          profile
        );

      const profileStrength =

        getProfileStrength(

          profileCompletion,

          trustScore

        );


      // ====================================
      // UPDATE ANALYTICS
      // ====================================
      profile.lastProfileUpdate =
        new Date();

      profile.profileCompleted =

        profileCompletion >= 60;

      profile.trustScore =
        trustScore;

      profile.profileStrength =
        profileStrength;


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

          branch:
            updatedProfile.branch,

          domain:
            updatedProfile.domain,

          bio:
            updatedProfile.bio,

          skills:
            updatedProfile.skills,

          interests:
            updatedProfile.interests,

          linkedinUrl:
            updatedProfile.linkedinUrl,

          githubUrl:
            updatedProfile.githubUrl,

          portfolioUrl:
            updatedProfile.portfolioUrl,

          experience:
            updatedProfile.experience,

          trustScore:
            updatedProfile.trustScore,

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

          trustScore,

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
          trustScore
          profileStrength
          mentorshipAvailable
          skills
          interests
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


      // ====================================
      // ANALYTICS
      // ====================================
      const profileCompletion =

        calculateProfileCompletion(
          profile
        );

      const trustScore =

        calculateTrustScore(
          profile
        );

      const profileStrength =

        getProfileStrength(

          profileCompletion,

          trustScore

        );


      res.status(200).json({

        success: true,

        profile,

        analytics: {

          profileCompletion,

          trustScore,

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
          companyName
          isOnline
          trustScore
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