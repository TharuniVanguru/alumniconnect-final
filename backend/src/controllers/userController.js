const User =
  require("../models/User");


// ===============================
// COSINE SIMILARITY
// ===============================
const cosineSimilarity =
  (arr1, arr2) => {

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
      (magnitude1 * magnitude2)
    );

  };


// ===============================
// GET AI RECOMMENDATIONS
// ===============================
const getRecommendations =
  async (req, res) => {

    try {

      const currentUser =
        await User.findById(
          req.user._id
        );

      if (!currentUser) {

        return res.status(404).json({
          message: "User not found",
        });

      }


      // ===============================
      // GET ALUMNI
      // ===============================
      const alumni =
        await User.find({

          role: "alumni",

          _id: {
            $ne: req.user._id,
          },

        });


      // ===============================
      // AI MATCHING
      // ===============================
      const scoredAlumni =
        alumni.map((mentor) => {

          let score = 0;


          // ===============================
          // DOMAIN MATCH
          // ===============================
          if (

            mentor.domain &&
            currentUser.domain &&

            mentor.domain
              .toLowerCase()
              .includes(
                currentUser.domain.toLowerCase()
              )

          ) {

            score += 30;

          }


          // ===============================
          // SKILLS SIMILARITY
          // ===============================
          const skillSimilarity =
            cosineSimilarity(

              currentUser.skills || [],
              mentor.skills || []

            );

          score +=
            skillSimilarity * 50;


          // ===============================
          // INTERESTS MATCH
          // ===============================
          const interestSimilarity =
            cosineSimilarity(

              currentUser.interests || [],
              mentor.skills || []

            );

          score +=
            interestSimilarity * 20;


          // ===============================
          // TRUST SCORE BONUS
          // ===============================
          score +=
            mentor.trustScore * 0.2;


          // ===============================
          // EXPERIENCE BONUS
          // ===============================
          if (
            mentor.bio &&
            mentor.bio.length > 100
          ) {

            score += 10;

          }


          return {

            ...mentor.toObject(),

            aiScore:
              Math.round(score),

          };

        });


      // ===============================
      // SORT
      // ===============================
      scoredAlumni.sort(

        (a, b) =>
          b.aiScore - a.aiScore

      );


      res.status(200).json(
        scoredAlumni
      );

    }

    catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

  };


// EXPORTS
module.exports = {
  getRecommendations,
};