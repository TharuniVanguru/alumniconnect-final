const mongoose = require("mongoose");

const notificationSchema =
  mongoose.Schema(
    {
      recipient: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      sender: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      title: {
        type: String,
        required: true,
      },

      message: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        enum: [
          "Job",
          "Mentorship",
          "Event",
          "System",
        ],
        default: "System",
      },

      isRead: {
        type: Boolean,
        default: false,
      },

      relatedId: {
        type:
          mongoose.Schema.Types.ObjectId,
      },
    },

    {
      timestamps: true,
    }
  );

const Notification =
  mongoose.model(
    "Notification",
    notificationSchema
  );

module.exports = Notification;