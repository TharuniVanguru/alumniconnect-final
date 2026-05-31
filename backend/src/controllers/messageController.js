const Message =
  require("../models/Message");

const Notification =
  require("../models/Notification");

const User =
  require("../models/User");

const mongoose =
  require("mongoose");


// ==========================================
// FORMAT MESSAGE
// ==========================================
const formatMessage = (
  msg
) => {

  return {

    _id:
      msg._id,

    senderId:
      msg.sender?._id ||
      msg.sender,

    receiverId:
      msg.receiver?._id ||
      msg.receiver,

    senderName:
      msg.sender?.name || "",

    receiverName:
      msg.receiver?.name || "",

    sender:
      msg.sender,

    receiver:
      msg.receiver,

    message:
      msg.message,

    messageType:
      msg.messageType,

    attachment:
      msg.attachment,

    isRead:
      msg.isRead,

    seenAt:
      msg.seenAt,

    status:
      msg.isRead
        ? "seen"
        : "sent",

    createdAt:
      msg.createdAt,

    updatedAt:
      msg.updatedAt,

  };

};


// ==========================================
// SEND MESSAGE
// ==========================================
const sendMessage =
  async (req, res) => {

    try {

      const {

        receiverId,

        message,

        messageType,

        attachment,

      } = req.body;


      // ====================================
      // VALIDATION
      // ====================================
      if (

        !receiverId ||

        !message?.trim()

      ) {

        return res.status(400).json({

          success: false,

          message:
            "receiverId and message are required",

        });

      }


      // ====================================
      // INVALID ID
      // ====================================
      if (

        !mongoose.Types.ObjectId.isValid(
          receiverId
        )

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid receiverId",

        });

      }


      // ====================================
      // SELF MESSAGE BLOCK
      // ====================================
      if (

        receiverId.toString() ===

        req.user._id.toString()

      ) {

        return res.status(400).json({

          success: false,

          message:
            "You cannot message yourself",

        });

      }


      // ====================================
      // CHECK RECEIVER
      // ====================================
      const receiver =
        await User.findById(
          receiverId
        );

      if (!receiver) {

        return res.status(404).json({

          success: false,

          message:
            "Receiver not found",

        });

      }


      // ====================================
      // CREATE MESSAGE
      // ====================================
      const createdMessage =
        await Message.create({

          sender:
            req.user._id,

          receiver:
            receiverId,

          message:
            message.trim(),

          messageType:
            messageType || "text",

          attachment:
            attachment || "",

          isRead: false,

        });


      // ====================================
      // POPULATE
      // ====================================
      const populatedMessage =
        await Message.findById(
          createdMessage._id
        )

          .populate(
            "sender",
            "name email role profileImage"
          )

          .populate(
            "receiver",
            "name email role profileImage"
          );


      // ====================================
      // CREATE NOTIFICATION
      // ====================================
      await Notification.create({

        recipient:
          receiverId,

        sender:
          req.user._id,

        title:
          "New Message",

        message:
          `${req.user.name} sent you a message`,

        type:
          "message",

        relatedId:
          createdMessage._id,

      });


      // ====================================
      // RESPONSE
      // ====================================
      return res.status(201).json({

        success: true,

        data:
          formatMessage(
            populatedMessage
          ),

      });

    }

    catch (error) {

      console.log(
        "SEND MESSAGE ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// GET CONVERSATION
// ==========================================
const getConversation =
  async (req, res) => {

    try {

      const userId =
        req.params.userId;

      const myId =
        req.user._id;


      // ====================================
      // VALIDATION
      // ====================================
      if (

        !mongoose.Types.ObjectId.isValid(
          userId
        )

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid userId",

        });

      }


      // ====================================
      // FETCH MESSAGES
      // ====================================
      const messages =
        await Message.find({

          $or: [

            {

              sender: myId,

              receiver: userId,

            },

            {

              sender: userId,

              receiver: myId,

            },

          ],

        })

          .sort({

            createdAt: 1,

          })

          .populate(
            "sender",
            "name role profileImage"
          )

          .populate(
            "receiver",
            "name role profileImage"
          );


      // ====================================
      // MARK AS READ
      // ====================================
      await Message.updateMany(

        {

          sender: userId,

          receiver: myId,

          isRead: false,

        },

        {

          $set: {

            isRead: true,

            seenAt:
              new Date(),

          },

        }

      );


      // ====================================
      // FORMAT RESPONSE
      // ====================================
      const formattedMessages =
        messages.map(
          formatMessage
        );


      // ====================================
      // RESPONSE
      // ====================================
      return res.status(200).json({

        success: true,

        count:
          formattedMessages.length,

        messages:
          formattedMessages,

      });

    }

    catch (error) {

      console.log(
        "GET CONVERSATION ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// GET CHAT LIST
// ==========================================
const getChatList =
  async (req, res) => {

    try {

      const myId =
        req.user._id;


      // ====================================
      // CHAT AGGREGATION
      // ====================================
      const chats =
        await Message.aggregate([

          {

            $match: {

              $or: [

                {

                  sender:
                    myId,

                },

                {

                  receiver:
                    myId,

                },

              ],

            },

          },

          {

            $sort: {

              createdAt: -1,

            },

          },

          {

            $group: {

              _id: {

                $cond: [

                  {

                    $eq: [

                      "$sender",

                      myId,

                    ],

                  },

                  "$receiver",

                  "$sender",

                ],

              },

              lastMessage: {

                $first:
                  "$message",

              },

              lastMessageTime: {

                $first:
                  "$createdAt",

              },

              unreadCount: {

                $sum: {

                  $cond: [

                    {

                      $and: [

                        {

                          $eq: [

                            "$receiver",

                            myId,

                          ],

                        },

                        {

                          $eq: [

                            "$isRead",

                            false,

                          ],

                        },

                      ],

                    },

                    1,

                    0,

                  ],

                },

              },

            },

          },

          {

            $lookup: {

              from: "users",

              localField: "_id",

              foreignField: "_id",

              as: "user",

            },

          },

          {

            $unwind: "$user",

          },

          {

            $project: {

              _id: 1,

              lastMessage: 1,

              lastMessageTime: 1,

              unreadCount: 1,

              user: {

                _id:
                  "$user._id",

                name:
                  "$user.name",

                email:
                  "$user.email",

                role:
                  "$user.role",

                profileImage:
                  "$user.profileImage",

              },

            },

          },

          {

            $sort: {

              lastMessageTime:
                -1,

            },

          },

        ]);


      // ====================================
      // RESPONSE
      // ====================================
      return res.status(200).json({

        success: true,

        chats,

      });

    }

    catch (error) {

      console.log(
        "CHAT LIST ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// MARK AS READ
// ==========================================
const markMessagesAsRead =
  async (req, res) => {

    try {

      const senderId =
        req.params.userId;


      // ====================================
      // VALIDATION
      // ====================================
      if (

        !mongoose.Types.ObjectId.isValid(
          senderId
        )

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid senderId",

        });

      }


      // ====================================
      // UPDATE
      // ====================================
      await Message.updateMany(

        {

          sender:
            senderId,

          receiver:
            req.user._id,

          isRead: false,

        },

        {

          $set: {

            isRead: true,

            seenAt:
              new Date(),

          },

        }

      );


      // ====================================
      // RESPONSE
      // ====================================
      return res.status(200).json({

        success: true,

        message:
          "Messages marked as read",

      });

    }

    catch (error) {

      console.log(
        "MARK READ ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// DELETE MESSAGE
// ==========================================
const deleteMessage =
  async (req, res) => {

    try {

      const messageId =
        req.params.messageId;

      const myId =
        req.user._id;


      // ====================================
      // VALIDATION
      // ====================================
      if (

        !mongoose.Types.ObjectId.isValid(
          messageId
        )

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid messageId",

        });

      }


      // ====================================
      // FIND MESSAGE
      // ====================================
      const message =
        await Message.findById(
          messageId
        );

      if (!message) {

        return res.status(404).json({

          success: false,

          message:
            "Message not found",

        });

      }


      // ====================================
      // ONLY SENDER DELETE
      // ====================================
      if (

        message.sender.toString() !==

        myId.toString()

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      // ====================================
      // DELETE
      // ====================================
      await message.deleteOne();


      // ====================================
      // RESPONSE
      // ====================================
      return res.status(200).json({

        success: true,

        message:
          "Message deleted successfully",

      });

    }

    catch (error) {

      console.log(
        "DELETE MESSAGE ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// EXPORTS
// ==========================================
module.exports = {

  sendMessage,

  getConversation,

  getChatList,

  markMessagesAsRead,

  deleteMessage,

};