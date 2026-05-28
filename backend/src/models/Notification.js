const mongoose =
  require("mongoose");


// ==========================================
// NOTIFICATION SCHEMA
// ==========================================
const notificationSchema =
  mongoose.Schema(

    {

      // ====================================
      // RECIPIENT
      // ====================================
      recipient: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,

      },


      // ====================================
      // SENDER
      // ====================================
      sender: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

      },


      // ====================================
      // TITLE
      // ====================================
      title: {

        type: String,

        required: true,

        trim: true,

        maxlength: 200,

      },


      // ====================================
      // MESSAGE
      // ====================================
      message: {

        type: String,

        required: true,

        trim: true,

        maxlength: 1000,

      },


      // ====================================
      // TYPE
      // ====================================
      type: {

        type: String,

        enum: [

          "message",

          "guidance",

          "mentorship",

          "job",

          "event",

          "system",

          "warning",

          "reminder",

        ],

        default: "system",

        index: true,

      },


      // ====================================
      // PRIORITY
      // ====================================
      priority: {

        type: String,

        enum: [

          "low",

          "medium",

          "high",

        ],

        default: "medium",

      },


      // ====================================
      // RELATED DOCUMENT
      // ====================================
      relatedId: {

        type:
          mongoose.Schema.Types.ObjectId,

      },


      // ====================================
      // ACTION LINK
      // ====================================
      actionLink: {

        type: String,

        default: "",

      },


      // ====================================
      // READ STATUS
      // ====================================
      isRead: {

        type: Boolean,

        default: false,

        index: true,

      },

      readAt: {

        type: Date,

      },


      // ====================================
      // DELIVERY STATUS
      // ====================================
      delivered: {

        type: Boolean,

        default: true,

      },


      // ====================================
      // PUSH NOTIFICATION
      // ====================================
      pushSent: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // EXPIRE NOTIFICATION
      // ====================================
      expiresAt: {

        type: Date,

      },

    },

    {

      timestamps: true,

    }

  );


// ==========================================
// INDEXES
// ==========================================
notificationSchema.index({

  recipient: 1,

  isRead: 1,

  createdAt: -1,

});


// ==========================================
// AUTO DELETE EXPIRED NOTIFICATIONS
// ==========================================
notificationSchema.index(

  {

    expiresAt: 1,

  },

  {

    expireAfterSeconds: 0,

  }

);


// ==========================================
// MODEL
// ==========================================
const Notification =
  mongoose.model(

    "Notification",

    notificationSchema

  );


// ==========================================
// EXPORT
// ==========================================
module.exports =
  Notification;