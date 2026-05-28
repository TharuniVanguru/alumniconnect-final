const Message =
  require("../models/Message");

const Notification =
  require("../models/Notification");

const mongoose =
  require("mongoose");


// ==========================================
// SEND MESSAGE
// ==========================================
const sendMessage =
  async (req, res) => {

    try {

      const {

        receiverId,
        receiverName,
        message,

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
      // CREATE MESSAGE
      // ====================================
      const newMessage =
        await Message.create({

          sender:
            req.user._id,

          receiver:
            receiverId,

          senderName:
            req.user.name,

          receiverName:
            receiverName || "",

          message:
            message.trim(),

          delivered: false,

          isRead: false,

        });


      // ====================================
      // POPULATE MESSAGE
      // ====================================
      const populatedMessage =
        await Message.findById(
          newMessage._id
        )

          .populate(
            "sender",
            "name email role"
          )

          .populate(
            "receiver",
            "name email role"
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
          newMessage._id,

        isRead: false,

      });


      // ====================================
      // RESPONSE
      // ====================================
      return res.status(201).json({

        success: true,

        message:
          populatedMessage,

      });

    }

    catch (error) {

      console.log(
        "SEND MESSAGE ERROR:",
        error
      );

      res.status(500).json({

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
            "name role"
          )

          .populate(
            "receiver",
            "name role"
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
      // RESPONSE
      // ====================================
      return res.status(200).json({

        success: true,

        messages,

      });

    }

    catch (error) {

      console.log(
        "GET CONVERSATION ERROR:",
        error
      );

      res.status(500).json({

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
      // AGGREGATION
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

              senderName: {

                $first:
                  "$senderName",

              },

              receiverName: {

                $first:
                  "$receiverName",

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

            $sort: {

              lastMessageTime:
                -1,

            },

          },

        ]);


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        chats,

      });

    }

    catch (error) {

      console.log(
        "CHAT LIST ERROR:",
        error
      );

      res.status(500).json({

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
      res.status(200).json({

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

      res.status(500).json({

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

};