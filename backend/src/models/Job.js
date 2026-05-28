const mongoose =
  require("mongoose");


// ==========================================
// APPLICATION SCHEMA
// ==========================================
const applicationSchema =
  mongoose.Schema({

    student: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },

    studentName: {

      type: String,

      trim: true,

    },

    studentEmail: {

      type: String,

      trim: true,

      lowercase: true,

    },

    resumeUrl: {

      type: String,

      default: "",

    },

    status: {

      type: String,

      enum: [

        "Applied",
        "Shortlisted",
        "Rejected",
        "Selected",

      ],

      default: "Applied",

    },

    appliedAt: {

      type: Date,

      default: Date.now,

    },

  });


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

        index: true,

      },


      // ====================================
      // LOCATION
      // ====================================
      location: {

        type: String,

        required: true,

        trim: true,

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

        ],

        default: "Internship",

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
      // REQUIRED SKILLS
      // ====================================
      skillsRequired: [

        {

          type: String,

          trim: true,

        },

      ],


      // ====================================
      // ELIGIBILITY
      // ====================================
      eligibility: {

        type: String,

        default: "",

      },


      // ====================================
      // EXPERIENCE REQUIRED
      // ====================================
      experienceRequired: {

        type: String,

        default: "",

      },


      // ====================================
      // SALARY
      // ====================================
      salary: {

        type: String,

        default: "",

      },


      // ====================================
      // APPLY LINK
      // ====================================
      applyLink: {

        type: String,

        default: "",

      },


      // ====================================
      // DEADLINE
      // ====================================
      deadline: {

        type: Date,

      },


      // ====================================
      // POSTED BY
      // ====================================
      postedBy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },

      postedByName: {

        type: String,

        default: "",

      },


      // ====================================
      // APPLICATIONS
      // ====================================
      applications: [

        applicationSchema,

      ],


      // ====================================
      // ACTIVE STATUS
      // ====================================
      isActive: {

        type: Boolean,

        default: true,

      },


      // ====================================
      // FEATURED JOB
      // ====================================
      isFeatured: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // ANALYTICS
      // ====================================
      views: {

        type: Number,

        default: 0,

      },

      totalApplications: {

        type: Number,

        default: 0,

      },

    },

    {

      timestamps: true,

    }

  );


// ==========================================
// SEARCH INDEX
// ==========================================
jobSchema.index({

  title: "text",

  company: "text",

  description: "text",

  skillsRequired: "text",

});


// ==========================================
// COMPOUND INDEX
// ==========================================
jobSchema.index({

  company: 1,
  type: 1,

});


// ==========================================
// AUTO UPDATE APPLICATION COUNT
// ==========================================
jobSchema.pre(

  "save",

  function (next) {

    this.totalApplications =
      this.applications.length;

    next();

  }

);


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