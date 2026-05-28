const User =
  require("../models/User");


// ==========================================
// COSINE SIMILARITY
// ==========================================
const cosineSimilarity =
  (arr1 = [], arr2 = []) => {

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
    if (user.skills?.length) completed++;
    if (user.interests?.length) completed++;
    if (user.bio) completed++;
    if (user.linkedinUrl) completed++;
    if (user.githubUrl) completed++;
    if (user.company) completed++;
    if (user.jobRole) completed++;
    if (user.profileStrength)
      completed++;

    return Math.floor(
      (completed / total) * 100
    );

  };


// ==========================================
// GET AI RECOMMENDATIONS
// ==========================================
const getRecommendations =
  async (req, res) => {

    try {

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
      // GET ALUMNI
      // ====================================
      const alumni =
        await User.find({

          role: "alumni",

          _id: {

            $ne:
              req.user._id,

          },

        }).select("-password");


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
          // SKILLS SIMILARITY
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
          // INTERESTS MATCH
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
            (mentor.trustScore || 0)
            * 0.25;


          // ==================================
          // VERIFIED PROFILE BONUS
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
            mentor.company
          ) {

            score += 15;

            reasons.push(
              `Works at ${mentor.company}`
            );

          }

          if (
            mentor.jobRole
          ) {

            score += 10;

          }


          // ==================================
          // BIO QUALITY BONUS
          // ==================================
          if (

            mentor.bio &&
            mentor.bio.length > 100

          ) {

            score += 10;

          }


          // ==================================
          // PROFILE STRENGTH
          // ==================================
          if (
            mentor.profileStrength ===
            "Excellent"
          ) {

            score += 15;

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

            (mentor.skills || [])
              .filter(

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

            company:
              mentor.company,

            jobRole:
              mentor.jobRole,

            bio:
              mentor.bio,

            linkedinUrl:
              mentor.linkedinUrl,

            githubUrl:
              mentor.githubUrl,

            profileStrength:
              mentor.profileStrength,

            trustScore:
              mentor.trustScore,

            mentorshipAvailable:
              mentor.mentorshipAvailable,

            matchedSkills,

            aiScore:
              Math.round(score),

            mentorLevel,

            profileCompletion,

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
      // TOP 10
      // ====================================
      const topMentors =
        scoredAlumni.slice(
          0,
          10
        );


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        total:
          topMentors.length,

        recommendations:
          topMentors,

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


// EXPORTS
module.exports = {

  getRecommendations,

};