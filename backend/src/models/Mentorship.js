const mongoose =
  require("mongoose");


// ==========================================
// MENTORSHIP SCHEMA
// ==========================================
const mentorshipSchema =
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

      studentName: {

        type: String,

        trim: true,

      },


      // ====================================
      // ALUMNI
      // ====================================
      alumni: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,

      },

      alumniName: {

        type: String,

        trim: true,

      },


      // ====================================
      // REQUEST MESSAGE
      // ====================================
      message: {

        type: String,

        required: true,

        trim: true,

        maxlength: 2000,

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
      // MENTORSHIP TYPE
      // ====================================
      mentorshipType: {

        type: String,

        enum: [

          "Career Guidance",

          "Interview Preparation",

          "Project Help",

          "Resume Review",

          "Placement Mentorship",

          "General Mentorship",

        ],

        default:
          "General Mentorship",

      },


      // ====================================
      // STATUS
      // ====================================
      status: {

        type: String,

        enum: [

          "Pending",

          "Accepted",

          "Rejected",

          "Scheduled",

          "Completed",

          "Cancelled",

        ],

        default: "Pending",

        index: true,

      },


      // ====================================
      // MEETING INFO
      // ====================================
      scheduledDate: {

        type: Date,

      },

      meetingLink: {

        type: String,

        trim: true,

      },

      duration: {

        type: Number,

        default: 30,

      },

      meetingCompleted: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // NOTES
      // ====================================
      mentorNotes: {

        type: String,

        default: "",

      },

      studentNotes: {

        type: String,

        default: "",

      },


      // ====================================
      // RESOURCES
      // ====================================
      resources: [

        {

          title: String,

          link: String,

        },

      ],


      // ====================================
      // FEEDBACK
      // ====================================
      feedback: {

        type: String,

        trim: true,

        maxlength: 1000,

      },

      rating: {

        type: Number,

        min: 1,

        max: 5,

      },


      // ====================================
      // CANCELLATION
      // ====================================
      cancellationReason: {

        type: String,

        default: "",

      },


      // ====================================
      // REMINDER
      // ====================================
      reminderSent: {

        type: Boolean,

        default: false,

      },

    },

    {

      timestamps: true,

    }

  );


// ==========================================
// INDEXES
// ==========================================
mentorshipSchema.index({

  student: 1,

  alumni: 1,

  status: 1,

});


// ==========================================
// MODEL
// ==========================================
const Mentorship =
  mongoose.model(

    "Mentorship",

    mentorshipSchema

  );


// ==========================================
// EXPORT
// ==========================================
module.exports =
  Mentorship;