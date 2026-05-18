const User =
  require("../models/User");


// ==============================
// GET RECOMMENDED ALUMNI
// ==============================
const getRecommendedAlumni =
  async (req, res) => {

    try {

      // LOGGED IN USER
      const student =
        await User.findById(
          req.user._id
        );

      if (!student) {

        return res.status(404).json({

          message:
            "Student not found",

        });

      }


      // GET ALL ALUMNI
      const alumni =
        await User.find({

          role: "alumni",

        });


      // CALCULATE MATCH SCORE
      const recommendations =
        alumni.map((alumniUser) => {

          let score = 0;

          // SKILLS MATCH
          const matchedSkills =
            alumniUser.skills.filter(
              (skill) =>

                student.skills.includes(
                  skill
                )
            );

          score +=
            matchedSkills.length * 20;


          // INTERESTS MATCH
          const matchedInterests =
            alumniUser.interests.filter(
              (interest) =>

                student.interests.includes(
                  interest
                )
            );

          score +=
            matchedInterests.length * 15;


          // DOMAIN MATCH
          if (
            alumniUser.domain ===
            student.domain
          ) {

            score += 30;

          }


          return {

            _id:
              alumniUser._id,

            name:
              alumniUser.name,

            email:
              alumniUser.email,

            domain:
              alumniUser.domain,

            skills:
              alumniUser.skills,

            interests:
              alumniUser.interests,

            trustScore:
              alumniUser.trustScore,

            matchScore:
              score,

            matchedSkills,

            matchedInterests,

          };

        });


      // SORT BY MATCH SCORE
      recommendations.sort(

        (a, b) =>

          b.matchScore -
          a.matchScore

      );


      res.status(200).json(
        recommendations
      );

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error",

      });

    }

  };


// EXPORT
module.exports = {

  getRecommendedAlumni,

};