const mongoose = require("mongoose");

const profileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // BASIC INFO
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    role: {
      type: String,
      enum: ["student", "alumni", "admin"],
      required: true,
    },

    identifier: {
      type: String,
    },

    branch: {
      type: String,
    },

    year: {
      type: String,
    },

    batch: {
      type: String,
    },

    // DOMAIN
    domain: {
      type: String,
    },

    // SKILLS
    skills: [
      {
        type: String,
      },
    ],

    // INTERESTS
    interests: [
      {
        type: String,
      },
    ],

    // SOCIAL LINKS
    linkedinUrl: {
      type: String,
    },

    githubUrl: {
      type: String,
    },

    portfolioUrl: {
      type: String,
    },

    // BIO
    bio: {
      type: String,
    },

    // PROJECTS
    projects: [
      {
        title: String,
        description: String,
        techStack: [String],
      },
    ],

    // ALUMNI FIELDS
    company: {
      type: String,
    },

    jobRole: {
      type: String,
    },

    experience: {
      type: String,
    },

    mentorshipAvailable: {
      type: Boolean,
      default: true,
    },

    // PROFILE STATUS
    profileCompleted: {
      type: Boolean,
      default: false,
    },

    trustScore: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    lastProfileUpdate: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  }
);

const Profile = mongoose.model(
  "Profile",
  profileSchema
);

module.exports = Profile;