const mongoose =
  require("mongoose");


// ==========================================
// GUIDANCE REQUEST SCHEMA
// ==========================================
const guidanceRequestSchema =
  new mongoose.Schema(

    {

      // ====================================
      // STUDENT
      // ====================================
      studentId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,

      },

      studentName: {

        type: String,

        required: true,

        trim: true,

      },


      // ====================================
      // ALUMNI
      // ====================================
      alumniId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,

      },

      alumniName: {

        type: String,

        required: true,

        trim: true,

      },


      // ====================================
      // GUIDANCE DETAILS
      // ====================================
      domain: {

        type: String,

        required: true,

        trim: true,

        index: true,

      },

      topic: {

        type: String,

        required: true,

        trim: true,

      },

      description: {

        type: String,

        required: true,

        trim: true,

        maxlength: 3000,

      },


      // ====================================
      // PRIORITY / URGENCY
      // ====================================
      urgency: {

        type: String,

        enum: [

          "Low",

          "Medium",

          "High",

        ],

        default: "Medium",

      },

      priorityScore: {

        type: Number,

        default: 0,

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
      // MEETING DETAILS
      // ====================================
      meetingLink: {

        type: String,

        default: "",

        trim: true,

      },

      scheduledDate: {

        type: Date,

      },

      duration: {

        type: Number,

        default: 30,

      },

      reminderSent: {

        type: Boolean,

        default: false,

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
      // FEEDBACK
      // ====================================
      feedback: {

        type: String,

        default: "",

        maxlength: 1000,

      },


      // ====================================
      // RATING
      // ====================================
      rating: {

        type: Number,

        min: 1,

        max: 5,

      },


      // ====================================
      // COMPLETION
      // ====================================
      completedAt: {

        type: Date,

      },


      // ====================================
      // CANCELLATION
      // ====================================
      cancellationReason: {

        type: String,

        default: "",

      },

    },

    {

      timestamps: true,

    }

  );


// ==========================================
// INDEXES
// ==========================================
guidanceRequestSchema.index({

  studentId: 1,

  alumniId: 1,

  status: 1,

});

guidanceRequestSchema.index({

  domain: 1,

  urgency: 1,

});


// ==========================================
// MODEL
// ==========================================
const GuidanceRequest =
  mongoose.model(

    "GuidanceRequest",

    guidanceRequestSchema

  );


// ==========================================
// EXPORT
// ==========================================
module.exports =
  GuidanceRequest;