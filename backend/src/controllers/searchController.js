const User =
  require("../models/User");


// ==========================================
// ADVANCED SEARCH USERS
// ==========================================
const searchUsers =
  async (req, res) => {

    try {

      // ====================================
      // QUERY PARAMS
      // ====================================
      const {

        keyword,
        role,
        domain,
        company,
        skill,
        interest,
        verified,
        sortBy,

      } = req.query;


      // ====================================
      // PAGINATION
      // ====================================
      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 10;

      const skip =
        (page - 1) * limit;


      // ====================================
      // FILTERS
      // ====================================
      const filters = {

        _id: {
          $ne: req.user._id,
        },

        isActive: true,

      };


      // ====================================
      // ROLE FILTER
      // ====================================
      if (role) {

        filters.role = role;

      }


      // ====================================
      // DOMAIN FILTER
      // ====================================
      if (domain) {

        filters.domain = {

          $regex: domain,

          $options: "i",

        };

      }


      // ====================================
      // COMPANY FILTER
      // ====================================
      if (company) {

        filters.company = {

          $regex: company,

          $options: "i",

        };

      }


      // ====================================
      // SKILLS FILTER
      // MULTIPLE SKILLS SUPPORT
      // ====================================
      if (skill) {

        const skillArray =
          skill.split(",");

        filters.skills = {

          $in: skillArray,

        };

      }


      // ====================================
      // INTEREST FILTER
      // ====================================
      if (interest) {

        const interestArray =
          interest.split(",");

        filters.interests = {

          $in: interestArray,

        };

      }


      // ====================================
      // VERIFIED FILTER
      // ====================================
      if (
        verified === "true"
      ) {

        filters.isVerified =
          true;

      }


      // ====================================
      // KEYWORD SEARCH
      // ====================================
      if (
        keyword &&
        keyword.trim() !== ""
      ) {

        filters.$or = [

          {

            name: {

              $regex: keyword,

              $options: "i",

            },

          },

          {

            domain: {

              $regex: keyword,

              $options: "i",

            },

          },

          {

            company: {

              $regex: keyword,

              $options: "i",

            },

          },

          {

            bio: {

              $regex: keyword,

              $options: "i",

            },

          },

          {

            skills: {

              $in: [keyword],

            },

          },

          {

            interests: {

              $in: [keyword],

            },

          },

        ];

      }


      // ====================================
      // SORTING
      // ====================================
      let sortOption = {

        createdAt: -1,

      };


      // TRUST SCORE
      if (
        sortBy === "trustScore"
      ) {

        sortOption = {

          trustScore: -1,

        };

      }


      // NAME
      if (
        sortBy === "name"
      ) {

        sortOption = {

          name: 1,

        };

      }


      // PROFILE COMPLETION
      if (
        sortBy === "profile"
      ) {

        sortOption = {

          profileCompleted: -1,

          trustScore: -1,

        };

      }


      // RECOMMENDED USERS
      if (
        sortBy === "recommended"
      ) {

        sortOption = {

          trustScore: -1,

          averageRating: -1,

          mentorshipCount: -1,

        };

      }


      // ====================================
      // FETCH USERS
      // ====================================
      const users =
        await User.find(filters)

        .select("-password")

        .sort(sortOption)

        .skip(skip)

        .limit(limit);


      // ====================================
      // TOTAL USERS
      // ====================================
      const total =
        await User.countDocuments(
          filters
        );


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        page,

        totalPages:
          Math.ceil(
            total / limit
          ),

        total,

        users,

      });

    }

    catch (error) {

      console.log(
        "SEARCH ERROR:",
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

  searchUsers,

};