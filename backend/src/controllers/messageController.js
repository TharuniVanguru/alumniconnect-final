const Message = require("../models/Message");
const Notification = require("../models/Notification");


// ===============================
// SEND MESSAGE
// ===============================

const sendMessage = async (req, res) => {

  try {

    const {
      receiver,
      receiverName,
      message,
    } = req.body;

    if (!receiver || !message) {
      return res.status(400).json({
        message: "receiver and message are required",
      });
    }

    const newMessage = await Message.create({

      sender: req.user._id,
      receiver: receiver,

      senderName: req.user.name,
      receiverName: receiverName || "",

      message: message,

      isRead: false,

    });


    // NOTIFICATION
    await Notification.create({

      recipient: receiver,
      sender: req.user._id,

      title: "New Message",

      message: `${req.user.name} sent you a message`,

      type: "message",

      relatedId: newMessage._id,

    });


    return res.status(201).json(newMessage);

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};


// ===============================
// GET CONVERSATION
// ===============================

const getConversation = async (req, res) => {

  try {

    const userId = req.params.userId;
    const myId = req.user._id;

    const messages = await Message.find({

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

    }).sort({ createdAt: 1 });


    // MARK AS READ (IMPORTANT)
    await Message.updateMany(

      {
        sender: userId,
        receiver: myId,
        isRead: false,
      },

      {
        $set: { isRead: true },
      }

    );


    return res.status(200).json(messages);

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};


// ===============================
// CHAT LIST (SIDEBAR)
// ===============================

const getChatList = async (req, res) => {

  try {

    const myId = req.user._id;

    const chats = await Message.aggregate([

      {
        $match: {
          $or: [
            { sender: myId },
            { receiver: myId }
          ]
        }
      },

      {
        $sort: { createdAt: -1 }
      },

      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", myId] },
              "$receiver",
              "$sender"
            ]
          },

          lastMessage: { $first: "$message" },
          lastMessageTime: { $first: "$createdAt" },

          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver", myId] },
                    { $eq: ["$isRead", false] }
                  ]
                },
                1,
                0
              ]
            }
          }

        }
      }

    ]);

    res.json(chats);

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};


// EXPORTS
module.exports = {
  sendMessage,
  getConversation,
  getChatList,
};