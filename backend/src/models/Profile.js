const mongoose =
  require("mongoose");


// ==========================================
// PROJECT SCHEMA
// ==========================================
const projectSchema =
  mongoose.Schema({

    title: {

      type: String,

      trim: true,

      required: true,

    },

    description: {

      type: String,

      trim: true,

      maxlength: 1000,

    },

    techStack: [

      {

        type: String,

        trim: true,

      },

    ],

    projectUrl: {

      type: String,

      trim: true,

    },

    githubUrl: {

      type: String,

      trim: true,

    },

  });


// ==========================================
// CERTIFICATE SCHEMA
// ==========================================
const certificateSchema =
  mongoose.Schema({

    title: {

      type: String,

      trim: true,

    },

    issuer: {

      type: String,

      trim: true,

    },

    certificateUrl: {

      type: String,

      trim: true,

    },

  });


// ==========================================
// PROFILE SCHEMA
// ==========================================
const profileSchema =
  mongoose.Schema(

    {

      // ====================================
      // USER
      // ====================================
      user: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        unique: true,

        index: true,

      },


      // ====================================
      // BASIC INFO
      // ====================================
      name: {

        type: String,

        required: true,

        trim: true,

      },

      email: {

        type: String,

        trim: true,

        lowercase: true,

        index: true,

      },

      role: {

        type: String,

        enum: [

          "student",
          "alumni",
          "faculty",
          "admin",

        ],

        required: true,

        index: true,

      },

      identifier: {

        type: String,

        trim: true,

        index: true,

      },

      phone: {

        type: String,

        trim: true,

      },

      profileImage: {

        type: String,

        default: "",

      },


      // ====================================
      // EDUCATION
      // ====================================
      branch: {

        type: String,

        trim: true,

        index: true,

      },

      year: {

        type: String,

        trim: true,

      },

      batch: {

        type: String,

        trim: true,

        index: true,

      },

      cgpa: {

        type: String,

        default: "",

      },


      // ====================================
      // DOMAIN
      // ====================================
      domain: {

        type: String,

        trim: true,

        index: true,

      },


      // ====================================
      // SKILLS
      // ====================================
      skills: [

        {

          type: String,

          trim: true,

        },

      ],


      // ====================================
      // INTERESTS
      // ====================================
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

        trim: true,

      },

      githubUrl: {

        type: String,

        trim: true,

      },

      portfolioUrl: {

        type: String,

        trim: true,

      },


      // ====================================
      // BIO
      // ====================================
      bio: {

        type: String,

        trim: true,

        maxlength: 1000,

      },


      // ====================================
      // RESUME
      // ====================================
      resumeUrl: {

        type: String,

        default: "",

      },


      // ====================================
      // PROJECTS
      // ====================================
      projects: [

        projectSchema,

      ],


      // ====================================
      // CERTIFICATES
      // ====================================
      certificates: [

        certificateSchema,

      ],


      // ====================================
      // ALUMNI INFO
      // ====================================
      company: {

        type: String,

        trim: true,

        index: true,

      },

      jobRole: {

        type: String,

        trim: true,

      },

      experience: {

        type: String,

        trim: true,

      },


      // ====================================
      // JOB POSTING
      // ====================================
      canPostJobs: {

        type: Boolean,

        default: false,

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
      // PROFILE STATUS
      // ====================================
      profileCompleted: {

        type: Boolean,

        default: false,

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

      isVerified: {

        type: Boolean,

        default: false,

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

      isOnline: {

        type: Boolean,

        default: false,

      },

    },

    {

      timestamps: true,

    }

  );


// ==========================================
// TEXT SEARCH INDEX
// ==========================================
profileSchema.index({

  name: "text",

  domain: "text",

  company: "text",

  jobRole: "text",

  bio: "text",

});


// ==========================================
// COMPOUND INDEXES
// ==========================================
profileSchema.index({

  role: 1,
  domain: 1,

});

profileSchema.index({

  skills: 1,

});


// ==========================================
// MODEL
// ==========================================
const Profile =
  mongoose.model(

    "Profile",

    profileSchema

  );


// ==========================================
// EXPORT
// ==========================================
module.exports =
  Profile;