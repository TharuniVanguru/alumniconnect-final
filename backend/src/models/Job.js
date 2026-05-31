const mongoose =
  require("mongoose");


// ==========================================
// APPLICATION SCHEMA
// ==========================================
const applicationSchema =
  mongoose.Schema(

    {

      // ====================================
      // STUDENT
      // ====================================
      student: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,

      },


      // ====================================
      // STUDENT INFO
      // ====================================
      studentName: {

        type: String,

        trim: true,

        maxlength: 100,

      },

      studentEmail: {

        type: String,

        trim: true,

        lowercase: true,

      },


      // ====================================
      // RESUME
      // ====================================
      resumeUrl: {

        type: String,

        default: "",

      },


      // ====================================
      // APPLICATION STATUS
      // ====================================
      status: {

        type: String,

        enum: [

          "Applied",

          "Shortlisted",

          "Interview",

          "Rejected",

          "Selected",

        ],

        default: "Applied",

        index: true,

      },


      // ====================================
      // COVER LETTER
      // ====================================
      coverLetter: {

        type: String,

        default: "",

        maxlength: 2000,

      },


      // ====================================
      // ATS SCORE
      // ====================================
      atsScore: {

        type: Number,

        default: 0,

        min: 0,

        max: 100,

      },


      // ====================================
      // APPLIED DATE
      // ====================================
      appliedAt: {

        type: Date,

        default: Date.now,

      },

    },

    {

      _id: true,

    }

  );


// ==========================================
// JOB SCHEMA
// ==========================================
const jobSchema =
  mongoose.Schema(

    {

      // ====================================
      // JOB TITLE
      // ====================================
      title: {

        type: String,

        required: true,

        trim: true,

        maxlength: 200,

        index: true,

      },


      // ====================================
      // COMPANY
      // ====================================
      company: {

        type: String,

        required: true,

        trim: true,

        maxlength: 200,

        index: true,

      },


      // ====================================
      // COMPANY LOGO
      // ====================================
      companyLogo: {

        type: String,

        default: "",

      },


      // ====================================
      // LOCATION
      // ====================================
      location: {

        type: String,

        required: true,

        trim: true,

        maxlength: 200,

      },


      // ====================================
      // JOB TYPE
      // ====================================
      type: {

        type: String,

        enum: [

          "Internship",

          "Full-time",

          "Part-time",

          "Remote",

          "Hybrid",

        ],

        default: "Internship",

        index: true,

      },


      // ====================================
      // EXPERIENCE LEVEL
      // ====================================
      experienceLevel: {

        type: String,

        enum: [

          "Fresher",

          "Junior",

          "Mid-Level",

          "Senior",

        ],

        default: "Fresher",

      },


      // ====================================
      // DESCRIPTION
      // ====================================
      description: {

        type: String,

        required: true,

        trim: true,

        maxlength: 5000,

      },


      // ====================================
      // RESPONSIBILITIES
      // ====================================
      responsibilities: [

        {

          type: String,

          trim: true,

        },

      ],


      // ====================================
      // REQUIRED SKILLS
      // ====================================
      skillsRequired: [

        {

          type: String,

          trim: true,

          lowercase: true,

        },

      ],


      // ====================================
      // PREFERRED SKILLS
      // ====================================
      preferredSkills: [

        {

          type: String,

          trim: true,

          lowercase: true,

        },

      ],


      // ====================================
      // ELIGIBILITY
      // ====================================
      eligibility: {

        type: String,

        default: "",

        trim: true,

      },


      // ====================================
      // EXPERIENCE REQUIRED
      // ====================================
      experienceRequired: {

        type: String,

        default: "",

        trim: true,

      },


      // ====================================
      // SALARY
      // ====================================
      salary: {

        type: String,

        default: "",

        trim: true,

      },


      // ====================================
      // APPLY LINK
      // ====================================
      applyLink: {

        type: String,

        default: "",

        trim: true,

      },


      // ====================================
      // DEADLINE
      // ====================================
      deadline: {

        type: Date,

        index: true,

      },


      // ====================================
      // POSTED BY
      // ====================================
      postedBy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,

      },

      postedByName: {

        type: String,

        default: "",

        trim: true,

      },


      // ====================================
      // APPLICATIONS
      // ====================================
      applications: [

        applicationSchema,

      ],


      // ====================================
      // SAVED USERS
      // ====================================
      savedBy: [

        {

          type:
            mongoose.Schema.Types.ObjectId,

          ref: "User",

        },

      ],


      // ====================================
      // ACTIVE STATUS
      // ====================================
      isActive: {

        type: Boolean,

        default: true,

        index: true,

      },


      // ====================================
      // FEATURED JOB
      // ====================================
      isFeatured: {

        type: Boolean,

        default: false,

        index: true,

      },


      // ====================================
      // VERIFIED JOB
      // ====================================
      isVerified: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // AI RECOMMENDED
      // ====================================
      aiRecommended: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // ANALYTICS
      // ====================================
      views: {

        type: Number,

        default: 0,

        min: 0,

      },

      clicks: {

        type: Number,

        default: 0,

      },

      totalApplications: {

        type: Number,

        default: 0,

        min: 0,

      },

      totalSaved: {

        type: Number,

        default: 0,

      },

    },

    {

      timestamps: true,

    }

  );


// ==========================================
// TEXT SEARCH INDEX
// ==========================================
jobSchema.index({

  title: "text",

  company: "text",

  description: "text",

  skillsRequired: "text",

  preferredSkills: "text",

});


// ==========================================
// COMPOUND INDEXES
// ==========================================
jobSchema.index({

  company: 1,

  type: 1,

});

jobSchema.index({

  isActive: 1,

  createdAt: -1,

});

jobSchema.index({

  isFeatured: 1,

  createdAt: -1,

});

jobSchema.index({

  postedBy: 1,

  createdAt: -1,

});

jobSchema.index({

  skillsRequired: 1,

  type: 1,

});


// ==========================================
// AUTO UPDATE COUNTS
// ==========================================
jobSchema.pre(

  "save",

  function (next) {

    this.totalApplications =
      this.applications.length;

    this.totalSaved =
      this.savedBy.length;

    next();

  }

);


// ==========================================
// CHECK DUPLICATE APPLICATION
// ==========================================
jobSchema.methods.hasApplied =
  function (studentId) {

    return this.applications.some(

      (app) =>

        app.student.toString() ===

        studentId.toString()

    );

  };


// ==========================================
// CHECK SAVED JOB
// ==========================================
jobSchema.methods.isSavedBy =
  function (userId) {

    return this.savedBy.some(

      (id) =>

        id.toString() ===

        userId.toString()

    );

  };


// ==========================================
// MODEL
// ==========================================
const Job =
  mongoose.model(

    "Job",

    jobSchema

  );


// ==========================================
// EXPORT
// ==========================================
module.exports =
  Job;