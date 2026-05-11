const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "alumni", "faculty", "admin"],
      default: "student",
    },

    branch: {
      type: String,
      default: "",
    },

    batch: {
      type: String,
      default: "",
    },

    domain: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    interests: {
      type: [String],
      default: [],
    },

    linkedinUrl: {
      type: String,
      default: "",
    },

    githubUrl: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    trustScore: {
      type: Number,
      default: 40,
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    isFirstLogin: {
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

module.exports = mongoose.model("User", userSchema);