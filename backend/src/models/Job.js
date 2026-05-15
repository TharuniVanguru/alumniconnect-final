const mongoose = require("mongoose");

const applicationSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studentName: {
      type: String,
    },

    studentEmail: {
      type: String,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

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

    description: {
      type: String,
      required: true,
    },

    skillsRequired: [
      {
        type: String,
      },
    ],

    salary: {
      type: String,
    },

    deadline: {
      type: Date,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    applications: [applicationSchema],

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

const Job = mongoose.model(
  "Job",
  jobSchema
);

module.exports = Job;