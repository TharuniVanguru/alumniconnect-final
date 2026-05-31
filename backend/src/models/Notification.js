const mongoose =
  require("mongoose");


// ==========================================
// NOTIFICATION SCHEMA
// ==========================================
const notificationSchema =
  new mongoose.Schema(

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

        default: null,

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

          "recommendation",

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

        default: null,

      },


      // ====================================
      // ACTION LINK
      // ====================================
      actionLink: {

        type: String,

        default: "",

        trim: true,

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

        default: null,

      },


      // ====================================
      // DELIVERY STATUS
      // ====================================
      delivered: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // PUSH NOTIFICATION
      // ====================================
      pushSent: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // SOCKET DELIVERED
      // ====================================
      socketDelivered: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // EMAIL SENT
      // ====================================
      emailSent: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // EXPIRE AT
      // ====================================
      expiresAt: {

        type: Date,

        default: null,

      },


      // ====================================
      // ICON
      // ====================================
      icon: {

        type: String,

        default: "🔔",

      },


      // ====================================
      // SOFT DELETE
      // ====================================
      deleted: {

        type: Boolean,

        default: false,

      },

    },

    {

      timestamps: true,

    }

  );


// ==========================================
// MAIN INDEX
// ==========================================
notificationSchema.index({

  recipient: 1,

  isRead: 1,

  createdAt: -1,

});


// ==========================================
// TYPE INDEX
// ==========================================
notificationSchema.index({

  recipient: 1,

  type: 1,

});


// ==========================================
// UNREAD INDEX
// ==========================================
notificationSchema.index({

  recipient: 1,

  isRead: 1,

});


// ==========================================
// CREATED DATE INDEX
// ==========================================
notificationSchema.index({

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