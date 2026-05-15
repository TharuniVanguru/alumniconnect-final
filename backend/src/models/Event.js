const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    organizerName: {
      type: String,
    },

    type: {
      type: String,
      enum: [
        "Workshop",
        "Webinar",
        "Networking",
        "Hackathon",
        "Mentorship",
      ],
      default: "Workshop",
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
    },

    location: {
      type: String,
    },

    mode: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Online",
    },

    meetingLink: {
      type: String,
    },

    maxAttendees: {
      type: Number,
      default: 100,
    },

    attendees: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        studentName: String,

        studentEmail: String,

        registeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    tags: [
      {
        type: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

const Event = mongoose.model(
  "Event",
  eventSchema
);

module.exports = Event;