const mongoose =
  require("mongoose");


// ==========================================
// MESSAGE SCHEMA
// ==========================================
const messageSchema =
  mongoose.Schema(

    {

      // ====================================
      // SENDER
      // ====================================
      sender: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,

      },


      // ====================================
      // RECEIVER
      // ====================================
      receiver: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,

      },


      // ====================================
      // USER NAMES
      // ====================================
      senderName: {

        type: String,

        trim: true,

      },

      receiverName: {

        type: String,

        trim: true,

      },


      // ====================================
      // MESSAGE CONTENT
      // ====================================
      message: {

        type: String,

        required: true,

        trim: true,

        maxlength: 5000,

      },


      // ====================================
      // MESSAGE TYPE
      // ====================================
      messageType: {

        type: String,

        enum: [

          "text",

          "image",

          "file",

          "audio",

          "video",

        ],

        default: "text",

      },


      // ====================================
      // FILE ATTACHMENT
      // ====================================
      attachment: {

        type: String,

        default: "",

      },


      // ====================================
      // MESSAGE STATUS
      // ====================================
      isRead: {

        type: Boolean,

        default: false,

      },

      delivered: {

        type: Boolean,

        default: false,

      },

      seenAt: {

        type: Date,

      },


      // ====================================
      // EDITED MESSAGE
      // ====================================
      isEdited: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // SOFT DELETE
      // ====================================
      deletedForSender: {

        type: Boolean,

        default: false,

      },

      deletedForReceiver: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // REACTIONS
      // ====================================
      reactions: [

        {

          userId: {

            type:
              mongoose.Schema.Types.ObjectId,

            ref: "User",

          },

          emoji: {

            type: String,

          },

        },

      ],

    },

    {

      timestamps: true,

    }

  );


// ==========================================
// CHAT INDEX
// ==========================================
messageSchema.index({

  sender: 1,

  receiver: 1,

  createdAt: -1,

});


// ==========================================
// MODEL
// ==========================================
const Message =
  mongoose.model(

    "Message",

    messageSchema

  );


// ==========================================
// EXPORT
// ==========================================
module.exports =
  Message;