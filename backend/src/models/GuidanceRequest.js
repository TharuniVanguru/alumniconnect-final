const mongoose =
  require("mongoose");


// ======================================
// GUIDANCE REQUEST SCHEMA
// ======================================
const guidanceRequestSchema =
  new mongoose.Schema(

    {

      // =========================
      // STUDENT
      // =========================
      studentId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },

      studentName: {

        type: String,

        required: true,

        trim: true,

      },


      // =========================
      // ALUMNI
      // =========================
      alumniId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },

      alumniName: {

        type: String,

        required: true,

        trim: true,

      },


      // =========================
      // GUIDANCE DETAILS
      // =========================
      domain: {

        type: String,

        required: true,

        trim: true,

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

      },


      // =========================
      // URGENCY
      // =========================
      urgency: {

        type: String,

        enum: [
          "Low",
          "Medium",
          "High",
        ],

        default: "Medium",

      },


      // =========================
      // STATUS
      // =========================
      status: {

        type: String,

        enum: [
          "Pending",
          "Accepted",
          "Rejected",
          "Completed",
        ],

        default: "Pending",

      },


      // =========================
      // MEETING DETAILS
      // =========================
      meetingLink: {

        type: String,

        default: "",

      },

      scheduledDate: {

        type: Date,

      },


      // =========================
      // FEEDBACK
      // =========================
      feedback: {

        type: String,

        default: "",

      },


      // =========================
      // RATING
      // =========================
      rating: {

        type: Number,

        min: 1,

        max: 5,

      },

    },

    {

      timestamps: true,

    }

  );


// ======================================
// MODEL
// ======================================
const GuidanceRequest =
  mongoose.model(

    "GuidanceRequest",

    guidanceRequestSchema

  );


// ======================================
// EXPORT
// ======================================
module.exports =
  GuidanceRequest;