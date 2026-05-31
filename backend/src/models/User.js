// ==========================================
// IMPORTS
// ==========================================
const mongoose =
  require("mongoose");


// ==========================================
// URL VALIDATOR
// ==========================================
const urlRegex =
  /^(https?:\/\/)?([\w\-])+\.{1}[a-zA-Z]{2,}(\/.*)?$/;


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

        lowercase: true,

        minlength: 3,

        maxlength: 50,

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

        match:
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

        index: true,

      },

      phone: {

        type: String,

        default: "",

        trim: true,

      },


      // ====================================
      // PASSWORD
      // ====================================
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

        index: true,

      },

      isOnline: {

        type: Boolean,

        default: false,

        index: true,

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
      // EDUCATION / PROFESSIONAL
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

      bio: {

        type: String,

        default: "",

        maxlength: 1000,

      },


      // ====================================
      // SKILLS
      // ====================================
      skills: [

        {

          type: String,

          trim: true,

          lowercase: true,

        },

      ],


      // ====================================
      // INTERESTS
      // ====================================
      interests: [

        {

          type: String,

          trim: true,

          lowercase: true,

        },

      ],


      // ====================================
      // SOCIAL LINKS
      // ====================================
      linkedinUrl: {

        type: String,

        default: "",

        trim: true,

        validate: {

          validator: function (v) {

            return (
              !v ||
              urlRegex.test(v)
            );

          },

          message:
            "Invalid LinkedIn URL",

        },

      },

      githubUrl: {

        type: String,

        default: "",

        trim: true,

        validate: {

          validator: function (v) {

            return (
              !v ||
              urlRegex.test(v)
            );

          },

          message:
            "Invalid GitHub URL",

        },

      },

      portfolioUrl: {

        type: String,

        default: "",

        trim: true,

        validate: {

          validator: function (v) {

            return (
              !v ||
              urlRegex.test(v)
            );

          },

          message:
            "Invalid Portfolio URL",

        },

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


      // ====================================
      // PROFILE ANALYTICS
      // ====================================
      trustScore: {

        type: Number,

        default: 40,

        min: 0,

        max: 100,

      },

      isVerified: {

        type: Boolean,

        default: false,

        index: true,

      },

      profileCompleted: {

        type: Number,

        default: 0,

        min: 0,

        max: 100,

      },

      averageRating: {

        type: Number,

        default: 0,

        min: 0,

        max: 5,

      },

      mentorshipCount: {

        type: Number,

        default: 0,

      },

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

      lastLogin: {

        type: Date,

        default: null,

      },

      lastActive: {

        type: Date,

        default: Date.now,

      },

      passwordChangedAt: {

        type: Date,

        default: null,

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

  skills: "text",

});


// ==========================================
// COMPOUND INDEXES
// ==========================================
userSchema.index({

  role: 1,

  domain: 1,

});

userSchema.index({

  branch: 1,

  batch: 1,

});

userSchema.index({

  isOnline: 1,

  lastActive: -1,

});


// ==========================================
// ACCOUNT LOCK VIRTUAL
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
// PROFILE COMPLETION METHOD
// ==========================================
userSchema.methods.calculateProfileStrength =
  function () {

    let score = 0;

    if (this.profileImage)
      score += 10;

    if (this.bio)
      score += 10;

    if (this.skills?.length)
      score += 20;

    if (this.interests?.length)
      score += 10;

    if (this.company)
      score += 15;

    if (this.githubUrl)
      score += 10;

    if (this.linkedinUrl)
      score += 10;

    if (this.resumeUrl)
      score += 15;

    this.trustScore = score;

    if (score < 30) {

      this.profileStrength =
        "Beginner";

    }

    else if (score < 60) {

      this.profileStrength =
        "Intermediate";

    }

    else if (score < 85) {

      this.profileStrength =
        "Strong";

    }

    else {

      this.profileStrength =
        "Excellent";

    }

  };


// ==========================================
// PRE SAVE MIDDLEWARE
// ==========================================
userSchema.pre(

  "save",

  function () {

    this.calculateProfileStrength();

  }

);

// ==========================================
// REMOVE PASSWORD
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