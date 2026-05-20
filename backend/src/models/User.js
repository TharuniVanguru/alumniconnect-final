const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(

  {

    // =========================
    // BASIC INFO
    // =========================
    identifier: {

      type: String,

      required: true,

      unique: true,

      trim: true,

    },

    name: {

      type: String,

      required: true,

      trim: true,

    },

    email: {

      type: String,

      required: true,

      unique: true,

      trim: true,

      lowercase: true,

    },

    phone: {

      type: String,

      default: "",

    },

    password: {

      type: String,

      required: true,

    },


    // =========================
    // ROLE
    // =========================
    role: {

      type: String,

      enum: [

        "student",

        "alumni",

        "faculty",

        "admin",

      ],

      default: "student",

    },


    // =========================
    // ACCOUNT STATUS
    // =========================
    isActive: {

      type: Boolean,

      default: true,

    },

    isVerified: {

      type: Boolean,

      default: true,

    },

    isOnline: {

      type: Boolean,

      default: false,

    },

    isFirstLogin: {

      type: Boolean,

      default: true,

    },


    // =========================
    // PROFILE INFO
    // =========================
    branch: {

      type: String,

      default: "",

    },

    batch: {

      type: String,

      default: "",

    },

    collegeName: {

      type: String,

      default: "",

    },

    domain: {

      type: String,

      default: "",

    },

    companyName: {

      type: String,

      default: "",

    },

    experience: {

      type: Number,

      default: 0,

    },

    bio: {

      type: String,

      default: "",

    },


    // =========================
    // SKILLS & INTERESTS
    // =========================
    skills: {

      type: [String],

      default: [],

    },

    interests: {

      type: [String],

      default: [],

    },


    // =========================
    // SOCIAL LINKS
    // =========================
    linkedinUrl: {

      type: String,

      default: "",

    },

    githubUrl: {

      type: String,

      default: "",

    },

    portfolioUrl: {

      type: String,

      default: "",

    },


    // =========================
    // PROFILE IMAGE
    // =========================
    profileImage: {

      type: String,

      default: "",

    },


    // =========================
    // TRUST & RATINGS
    // =========================
    trustScore: {

      type: Number,

      default: 40,

    },

    averageRating: {

      type: Number,

      default: 0,

    },

    totalRatings: {

      type: Number,

      default: 0,

    },

    mentorshipCount: {

      type: Number,

      default: 0,

    },


    // =========================
    // LAST PROFILE UPDATE
    // =========================
    lastProfileUpdate: {

      type: Date,

      default: Date.now,

    },

  },

  {

    timestamps: true,

  }

);

module.exports =

  mongoose.model(

    "User",

    userSchema

  );