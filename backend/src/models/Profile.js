const mongoose =
  require("mongoose");


// ==========================================
// PROJECT SCHEMA
// ==========================================
const projectSchema =
  new mongoose.Schema({

    title: {

      type: String,

      required: true,

      trim: true,

      maxlength: 100,

    },

    description: {

      type: String,

      trim: true,

      maxlength: 500,

      default: "",

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

      default: "",

    },

    githubUrl: {

      type: String,

      trim: true,

      default: "",

    },

  });


// ==========================================
// CERTIFICATE SCHEMA
// ==========================================
const certificateSchema =
  new mongoose.Schema({

    title: {

      type: String,

      trim: true,

      default: "",

    },

    issuer: {

      type: String,

      trim: true,

      default: "",

    },

    certificateUrl: {

      type: String,

      trim: true,

      default: "",

    },

  });


// ==========================================
// PROFILE SCHEMA
// ==========================================
const profileSchema =
  new mongoose.Schema(

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

      },

      identifier: {

        type: String,

        trim: true,

      },

      phone: {

        type: String,

        trim: true,

        default: "",

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

        default: "",

      },

      year: {

        type: String,

        trim: true,

        default: "",

      },

      batch: {

        type: String,

        trim: true,

        default: "",

      },

      cgpa: {

        type: String,

        default: "",

      },


      // ====================================
      // DOMAIN & SKILLS
      // ====================================
      domain: {

        type: String,

        trim: true,

        default: "",

      },

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

        trim: true,

        default: "",

      },

      githubUrl: {

        type: String,

        trim: true,

        default: "",

      },

      portfolioUrl: {

        type: String,

        trim: true,

        default: "",

      },


      // ====================================
      // BIO
      // ====================================
      bio: {

        type: String,

        trim: true,

        maxlength: 1000,

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

        default: "",

      },

      jobRole: {

        type: String,

        trim: true,

        default: "",

      },

      experience: {

        type: String,

        trim: true,

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
      // PROFILE STATUS
      // ====================================
      profileCompleted: {

        type: Boolean,

        default: false,

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

  skills: "text",

});


// ==========================================
// SIMPLE INDEXES
// ==========================================
profileSchema.index({

  role: 1,

});

profileSchema.index({

  branch: 1,

});

profileSchema.index({

  batch: 1,

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