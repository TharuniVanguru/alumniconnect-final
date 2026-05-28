const mongoose =
  require("mongoose");


// ==========================================
// USER SCHEMA
// ==========================================
const userSchema =
  new mongoose.Schema(

    {

      // ====================================
      // BASIC INFO
      // ====================================
      identifier: {

        type: String,

        required: true,

        unique: true,

        trim: true,

        index: true,

      },

      name: {

        type: String,

        required: true,

        trim: true,

        minlength: 2,

        maxlength: 100,

      },

      email: {

        type: String,

        required: true,

        unique: true,

        trim: true,

        lowercase: true,

        index: true,

      },

      phone: {

        type: String,

        default: "",

        trim: true,

      },

      password: {

        type: String,

        required: true,

        minlength: 6,

        select: false,

      },


      // ====================================
      // ROLE
      // ====================================
      role: {

        type: String,

        enum: [

          "student",
          "alumni",
          "faculty",
          "admin",

        ],

        default: "student",

        index: true,

      },


      // ====================================
      // ACCOUNT STATUS
      // ====================================
      isActive: {

        type: Boolean,

        default: true,

      },

      isVerified: {

        type: Boolean,

        default: false,

      },

      isOnline: {

        type: Boolean,

        default: false,

      },

      isFirstLogin: {

        type: Boolean,

        default: true,

      },


      // ====================================
      // LOGIN SECURITY
      // ====================================
      loginAttempts: {

        type: Number,

        default: 0,

      },

      lockUntil: {

        type: Date,

        default: null,

      },


      // ====================================
      // PROFILE INFO
      // ====================================
      branch: {

        type: String,

        default: "",

        trim: true,

        index: true,

      },

      batch: {

        type: String,

        default: "",

        trim: true,

        index: true,

      },

      collegeName: {

        type: String,

        default: "",

        trim: true,

      },

      domain: {

        type: String,

        default: "",

        trim: true,

        index: true,

      },

      company: {

        type: String,

        default: "",

        trim: true,

        index: true,

      },

      jobRole: {

        type: String,

        default: "",

        trim: true,

      },

      experience: {

        type: Number,

        default: 0,

        min: 0,

      },

      bio: {

        type: String,

        default: "",

        maxlength: 1000,

      },


      // ====================================
      // SKILLS & INTERESTS
      // ====================================
      skills: [

        {

          type: String,

          trim: true,

        },

      ],

      interests: [

        {

          type: String,

          trim: true,

        },

      ],


      // ====================================
      // SOCIAL LINKS
      // ====================================
      linkedinUrl: {

        type: String,

        default: "",

        trim: true,

      },

      githubUrl: {

        type: String,

        default: "",

        trim: true,

      },

      portfolioUrl: {

        type: String,

        default: "",

        trim: true,

      },


      // ====================================
      // PROFILE IMAGE
      // ====================================
      profileImage: {

        type: String,

        default: "",

      },


      // ====================================
      // RESUME
      // ====================================
      resumeUrl: {

        type: String,

        default: "",

      },


      // ====================================
      // MENTORSHIP
      // ====================================
      mentorshipAvailable: {

        type: Boolean,

        default: true,

      },

      mentorshipCount: {

        type: Number,

        default: 0,

      },


      // ====================================
      // TRUST & RATINGS
      // ====================================
      trustScore: {

        type: Number,

        default: 40,

        min: 0,

        max: 100,

      },

      averageRating: {

        type: Number,

        default: 0,

      },

      totalRatings: {

        type: Number,

        default: 0,

      },


      // ====================================
      // PROFILE STRENGTH
      // ====================================
      profileStrength: {

        type: String,

        enum: [

          "Beginner",
          "Intermediate",
          "Strong",
          "Excellent",

        ],

        default: "Beginner",

      },


      // ====================================
      // ACTIVITY
      // ====================================
      lastProfileUpdate: {

        type: Date,

        default: Date.now,

      },

      lastActive: {

        type: Date,

        default: Date.now,

      },

    },

    {

      timestamps: true,

    }

  );


// ==========================================
// TEXT SEARCH INDEX
// ==========================================
userSchema.index({

  name: "text",

  domain: "text",

  company: "text",

  jobRole: "text",

  bio: "text",

});


// ==========================================
// COMPOUND INDEXES
// ==========================================
userSchema.index({

  role: 1,
  domain: 1,

});

userSchema.index({

  skills: 1,

});


// ==========================================
// VIRTUAL
// ==========================================
userSchema.virtual(
  "isLocked"
).get(function () {

  return !!(

    this.lockUntil &&

    this.lockUntil > Date.now()

  );

});


// ==========================================
// REMOVE PASSWORD IN RESPONSE
// ==========================================
userSchema.methods.toJSON =
  function () {

    const user =
      this.toObject();

    delete user.password;

    return user;

  };


// ==========================================
// MODEL
// ==========================================
const User =
  mongoose.model(

    "User",

    userSchema

  );


// ==========================================
// EXPORT
// ==========================================
module.exports =
  User;