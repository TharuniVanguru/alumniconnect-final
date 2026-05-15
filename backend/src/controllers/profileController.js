const Profile = require("../models/Profile");


// =====================================
// GET LOGGED IN USER PROFILE
// =====================================

const getMyProfile = async (req, res) => {

  try {

    let profile = await Profile.findOne({
      user: req.user._id,
    });

    // CREATE PROFILE IF NOT EXISTS
    if (!profile) {

      profile = await Profile.create({
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        identifier: req.user.identifier,
      });

    }

    res.status(200).json(profile);

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


// =====================================
// UPDATE PROFILE
// =====================================

const updateProfile = async (req, res) => {

  try {

    const profile = await Profile.findOne({
      user: req.user._id,
    });

    if (!profile) {

      return res.status(404).json({
        message: "Profile not found",
      });

    }

    profile.name = req.body.name || profile.name;
    profile.branch = req.body.branch || profile.branch;
    profile.year = req.body.year || profile.year;
    profile.batch = req.body.batch || profile.batch;
    profile.domain = req.body.domain || profile.domain;
    profile.skills = req.body.skills || profile.skills;
    profile.interests = req.body.interests || profile.interests;
    profile.linkedinUrl = req.body.linkedinUrl || profile.linkedinUrl;
    profile.githubUrl = req.body.githubUrl || profile.githubUrl;
    profile.portfolioUrl = req.body.portfolioUrl || profile.portfolioUrl;
    profile.bio = req.body.bio || profile.bio;
    profile.company = req.body.company || profile.company;
    profile.jobRole = req.body.jobRole || profile.jobRole;
    profile.experience = req.body.experience || profile.experience;

    profile.mentorshipAvailable =
      req.body.mentorshipAvailable ?? profile.mentorshipAvailable;

    profile.lastProfileUpdate = new Date();
    profile.profileCompleted = true;

    // TRUST SCORE
    let trustScore = 40;

    if (profile.linkedinUrl) trustScore += 20;
    if (profile.githubUrl) trustScore += 10;
    if (profile.bio) trustScore += 10;

    if (profile.skills && profile.skills.length > 0) {
      trustScore += 10;
    }

    profile.trustScore = trustScore;

    const updatedProfile = await profile.save();

    res.status(200).json(updatedProfile);

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


// =====================================
// GET ALL ALUMNI (FOR DIRECTORY)
// =====================================

const getAllAlumni = async (req, res) => {

  try {

    const alumni = await Profile.find({
      role: "alumni",
    }).select(
      "name email domain company jobRole"
    );

    res.status(200).json(alumni);

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


// =====================================
// GET PROFILE BY ID
// =====================================

const getProfileById = async (req, res) => {

  try {

    const profile = await Profile.findById(
      req.params.id
    );

    if (!profile) {

      return res.status(404).json({
        message: "Profile not found",
      });

    }

    res.status(200).json(profile);

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};


// =====================================
// NEW: CHAT USERS LIST (IMPORTANT)
// =====================================

const getChatUsers = async (req, res) => {

  try {

    const currentUserId = req.user._id;

    const users = await Profile.find({
      user: { $ne: currentUserId },
    }).select(
      "user name role email company jobRole isOnline"
    );

    res.status(200).json(users);

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
  getMyProfile,
  updateProfile,
  getAllAlumni,
  getProfileById,
  getChatUsers,
};