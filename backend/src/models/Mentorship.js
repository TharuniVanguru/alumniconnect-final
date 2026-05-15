const mongoose = require("mongoose");

const mentorshipSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studentName: {
      type: String,
    },

    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    alumniName: {
      type: String,
    },

    message: {
      type: String,
      required: true,
    },

    domain: {
      type: String,
    },

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

    scheduledDate: {
      type: Date,
    },

    meetingLink: {
      type: String,
    },

    feedback: {
      type: String,
    },

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

const Mentorship = mongoose.model(
  "Mentorship",
  mentorshipSchema
);

module.exports = Mentorship;