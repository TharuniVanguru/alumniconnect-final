const mongoose =
  require("mongoose");


// ==========================================
// MESSAGE SCHEMA
// ==========================================
const messageSchema =
  new mongoose.Schema(

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
      // MESSAGE CONTENT
      // ====================================
      message: {

        type: String,

        required: true,

        trim: true,

        maxlength: 3000,

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
      // ATTACHMENT
      // ====================================
      attachment: {

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


      // ====================================
      // DELIVERED STATUS
      // ====================================
      isDelivered: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // SEEN TIME
      // ====================================
      seenAt: {

        type: Date,

        default: null,

      },


      // ====================================
      // DELIVERED TIME
      // ====================================
      deliveredAt: {

        type: Date,

        default: null,

      },


      // ====================================
      // SOFT DELETE
      // ====================================
      isDeleted: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // DELETE FOR USERS
      // ====================================
      deletedFor: [

        {

          type:
            mongoose.Schema.Types.ObjectId,

          ref: "User",

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
// REVERSE CHAT INDEX
// ==========================================
messageSchema.index({

  receiver: 1,

  sender: 1,

  createdAt: -1,

});


// ==========================================
// UNREAD INDEX
// ==========================================
messageSchema.index({

  receiver: 1,

  isRead: 1,

});


// ==========================================
// DELIVERY INDEX
// ==========================================
messageSchema.index({

  receiver: 1,

  isDelivered: 1,

});


// ==========================================
// CREATED TIME INDEX
// ==========================================
messageSchema.index({

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