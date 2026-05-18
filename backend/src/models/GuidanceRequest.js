const mongoose =
  require("mongoose");

const guidanceRequestSchema =
  mongoose.Schema(

    {

      studentId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },

      studentName: {

        type: String,

        required: true,

      },

      alumniId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },

      // NEW
      alumniName: {

        type: String,

      },

      domain: {

        type: String,

        required: true,

      },

      topic: {

        type: String,

        required: true,

      },

      description: {

        type: String,

        required: true,

      },

      urgency: {

        type: String,

        enum: [
          "Low",
          "Medium",
          "High",
        ],

        default: "Medium",

      },

      status: {

        type: String,

        enum: [
          "Pending",
          "Accepted",
          "Rejected",
        ],

        default: "Pending",

      },

    },

    {

      timestamps: true,

    }

  );

const GuidanceRequest =
  mongoose.model(
    "GuidanceRequest",
    guidanceRequestSchema
  );

module.exports =
  GuidanceRequest;