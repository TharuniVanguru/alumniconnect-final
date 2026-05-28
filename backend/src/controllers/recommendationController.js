const User =
  require("../models/User");


// ==========================================
// COSINE SIMILARITY
// ==========================================
const cosineSimilarity =
  (
    arr1 = [],
    arr2 = []
  ) => {

    const allSkills =

      [...new Set([

        ...arr1,
        ...arr2,

      ])];


    const vector1 =
      allSkills.map(

        (skill) =>

          arr1.includes(skill)
            ? 1
            : 0

      );


    const vector2 =
      allSkills.map(

        (skill) =>

          arr2.includes(skill)
            ? 1
            : 0

      );


    let dotProduct = 0;

    let magnitude1 = 0;

    let magnitude2 = 0;


    for (
      let i = 0;
      i < allSkills.length;
      i++
    ) {

      dotProduct +=

        vector1[i] *
        vector2[i];

      magnitude1 +=

        vector1[i] *
        vector1[i];

      magnitude2 +=

        vector2[i] *
        vector2[i];

    }


    magnitude1 =
      Math.sqrt(magnitude1);

    magnitude2 =
      Math.sqrt(magnitude2);


    if (

      magnitude1 === 0 ||

      magnitude2 === 0

    ) {

      return 0;

    }


    return (

      dotProduct /

      (
        magnitude1 *
        magnitude2
      )

    );

  };


// ==========================================
// PROFILE COMPLETION
// ==========================================
const calculateProfileCompletion =
  (user) => {

    let completed = 0;

    const total = 10;


    if (user.name) completed++;

    if (user.domain) completed++;

    if (user.skills?.length)
      completed++;

    if (user.interests?.length)
      completed++;

    if (user.bio) completed++;

    if (user.linkedinUrl)
      completed++;

    if (user.githubUrl)
      completed++;

    if (user.companyName)
      completed++;

    if (user.experience)
      completed++;

    if (user.profileImage)
      completed++;


    return Math.floor(

      (completed / total) * 100

    );

  };


// ==========================================
// GET RECOMMENDED ALUMNI
// ==========================================
const getRecommendedAlumni =
  async (req, res) => {

    try {

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
      // CURRENT USER
      // ====================================
      const currentUser =
        await User.findById(
          req.user._id
        );


      if (!currentUser) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      // ====================================
      // FILTERS
      // ====================================
      const filters = {

        role: "alumni",

        isActive: true,

        _id: {

          $ne:
            req.user._id,

        },

      };


      // ====================================
      // OPTIONAL FILTERS
      // ====================================
      if (req.query.domain) {

        filters.domain = {

          $regex:
            req.query.domain,

          $options: "i",

        };

      }


      if (req.query.company) {

        filters.companyName = {

          $regex:
            req.query.company,

          $options: "i",

        };

      }


      if (req.query.skill) {

        filters.skills = {

          $in: [
            req.query.skill,
          ],

        };

      }


      if (
        req.query.verified ===
        "true"
      ) {

        filters.isVerified =
          true;

      }


      // ====================================
      // FETCH ALUMNI
      // ====================================
      const alumni =
        await User.find(filters)

          .select("-password")

          .skip(skip)

          .limit(limit);


      // ====================================
      // TOTAL COUNT
      // ====================================
      const total =
        await User.countDocuments(
          filters
        );


      // ====================================
      // AI MATCHING
      // ====================================
      const scoredAlumni =
        alumni.map((mentor) => {

          let score = 0;

          const reasons = [];

          const smartTags = [];


          // ==================================
          // DOMAIN MATCH
          // ==================================
          if (

            mentor.domain &&
            currentUser.domain &&

            mentor.domain
              .toLowerCase()

              .includes(

                currentUser.domain
                  .toLowerCase()

              )

          ) {

            score += 40;

            reasons.push(
              "Strong domain match"
            );

            smartTags.push(
              "Domain Expert"
            );

          }


          // ==================================
          // SKILL MATCH
          // ==================================
          const skillSimilarity =

            cosineSimilarity(

              currentUser.skills || [],

              mentor.skills || []

            );


          score +=
            skillSimilarity * 50;


          if (
            skillSimilarity > 0.5
          ) {

            reasons.push(
              "High skill similarity"
            );

            smartTags.push(
              "Skill Match"
            );

          }


          // ==================================
          // INTEREST MATCH
          // ==================================
          const interestSimilarity =

            cosineSimilarity(

              currentUser.interests || [],

              mentor.interests || []

            );


          score +=
            interestSimilarity * 20;


          if (
            interestSimilarity > 0.4
          ) {

            reasons.push(
              "Shared interests"
            );

          }


          // ==================================
          // TRUST SCORE BONUS
          // ==================================
          score +=

            (
              mentor.trustScore || 0
            ) * 0.25;


          // ==================================
          // VERIFIED BONUS
          // ==================================
          if (
            mentor.isVerified
          ) {

            score += 15;

            smartTags.push(
              "Verified"
            );

          }


          // ==================================
          // PROFILE COMPLETION
          // ==================================
          const profileCompletion =

            calculateProfileCompletion(
              mentor
            );


          score +=
            profileCompletion * 0.2;


          // ==================================
          // EXPERIENCE BONUS
          // ==================================
          if (
            mentor.companyName
          ) {

            score += 15;

            reasons.push(

              `Works at ${mentor.companyName}`

            );

          }


          if (
            mentor.experience > 0
          ) {

            score +=
              mentor.experience;

          }


          // ==================================
          // BIO BONUS
          // ==================================
          if (

            mentor.bio &&
            mentor.bio.length > 100

          ) {

            score += 10;

          }


          // ==================================
          // MENTOR LEVEL
          // ==================================
          let mentorLevel =
            "Beginner Mentor";


          if (score >= 140) {

            mentorLevel =
              "Elite Mentor";

          }

          else if (
            score >= 100
          ) {

            mentorLevel =
              "Top Mentor";

          }

          else if (
            score >= 70
          ) {

            mentorLevel =
              "Strong Mentor";

          }


          // ==================================
          // MATCHED SKILLS
          // ==================================
          const matchedSkills =

            (
              mentor.skills || []
            ).filter(

              (skill) =>

                (
                  currentUser.skills || []
                )

                .includes(skill)

            );


          // ==================================
          // FINAL RESPONSE
          // ==================================
          return {

            _id:
              mentor._id,

            name:
              mentor.name,

            email:
              mentor.email,

            domain:
              mentor.domain,

            companyName:
              mentor.companyName,

            bio:
              mentor.bio,

            skills:
              mentor.skills,

            interests:
              mentor.interests,

            linkedinUrl:
              mentor.linkedinUrl,

            githubUrl:
              mentor.githubUrl,

            portfolioUrl:
              mentor.portfolioUrl,

            profileImage:
              mentor.profileImage,

            trustScore:
              mentor.trustScore || 0,

            mentorshipAvailable:
              mentor.mentorshipAvailable,

            profileCompletion,

            matchedSkills,

            aiScore:
              Math.round(score),

            mentorLevel,

            reasons,

            smartTags,

          };

        });


      // ====================================
      // SORT BEST MATCHES
      // ====================================
      scoredAlumni.sort(

        (a, b) =>

          b.aiScore -
          a.aiScore

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

        recommendations:
          scoredAlumni,

      });

    }

    catch (error) {

      console.log(

        "RECOMMENDATION ERROR:",

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

  getRecommendedAlumni,

};