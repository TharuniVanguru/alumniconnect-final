const Notification =
  require(
    "../models/Notification"
  );

const mongoose =
  require("mongoose");


// ==========================================
// GET NOTIFICATIONS
// ==========================================
const getNotifications =
  async (req, res) => {

    try {

      // ====================================
      // QUERY PARAMS
      // ====================================
      const {

        type,
        isRead,
        priority,

      } = req.query;


      // ====================================
      // PAGINATION
      // ====================================
      const page =
        Math.max(
          Number(req.query.page) || 1,
          1
        );

      const limit =
        Math.min(
          Number(req.query.limit) || 20,
          100
        );

      const skip =
        (page - 1) * limit;


      // ====================================
      // FILTERS
      // ====================================
      const filters = {

        recipient:
          req.user._id,

        deleted: false,

      };


      if (type) {

        filters.type =
          type;

      }


      if (
        isRead === "true"
      ) {

        filters.isRead =
          true;

      }

      else if (
        isRead === "false"
      ) {

        filters.isRead =
          false;

      }


      if (priority) {

        filters.priority =
          priority;

      }


      // ====================================
      // GET NOTIFICATIONS
      // ====================================
      const notifications =
        await Notification.find(
          filters
        )

          .populate(
            "sender",
            "name email role profileImage"
          )

          .sort({

            createdAt: -1,

          })

          .skip(skip)

          .limit(limit)

          .lean();


      // ====================================
      // COUNTS
      // ====================================
      const unreadCount =
        await Notification.countDocuments({

          recipient:
            req.user._id,

          isRead: false,

          deleted: false,

        });


      const total =
        await Notification.countDocuments(
          filters
        );


      // ====================================
      // RESPONSE
      // ====================================
      return res.status(200).json({

        success: true,

        total,

        unreadCount,

        currentPage:
          page,

        totalPages:
          Math.ceil(
            total / limit
          ),

        notifications,

      });

    }

    catch (error) {

      console.log(
        "GET NOTIFICATIONS ERROR:",
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
// GET UNREAD COUNT
// ==========================================
const getUnreadCount =
  async (req, res) => {

    try {

      const unreadCount =
        await Notification.countDocuments({

          recipient:
            req.user._id,

          isRead: false,

          deleted: false,

        });


      return res.status(200).json({

        success: true,

        unreadCount,

      });

    }

    catch (error) {

      console.log(
        "UNREAD COUNT ERROR:",
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
// MARK SINGLE NOTIFICATION READ
// ==========================================
const markNotificationRead =
  async (req, res) => {

    try {

      const notification =
        await Notification.findById(

          req.params.id

        );


      // ====================================
      // NOT FOUND
      // ====================================
      if (!notification) {

        return res.status(404).json({

          success: false,

          message:
            "Notification not found",

        });

      }


      // ====================================
      // OWNER CHECK
      // ====================================
      if (

        notification.recipient.toString() !==

        req.user._id.toString()

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      // ====================================
      // UPDATE
      // ====================================
      notification.isRead =
        true;

      notification.readAt =
        new Date();


      await notification.save();


      // ====================================
      // RESPONSE
      // ====================================
      return res.status(200).json({

        success: true,

        notification,

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
// MARK ALL READ
// ==========================================
const markAllNotificationsRead =
  async (req, res) => {

    try {

      await Notification.updateMany(

        {

          recipient:
            req.user._id,

          isRead: false,

          deleted: false,

        },

        {

          $set: {

            isRead: true,

            readAt:
              new Date(),

          },

        }

      );


      return res.status(200).json({

        success: true,

        message:

          "All notifications marked as read",

      });

    }

    catch (error) {

      console.log(
        "MARK ALL READ ERROR:",
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
// DELETE SINGLE NOTIFICATION
// ==========================================
const deleteNotification =
  async (req, res) => {

    try {

      const notification =
        await Notification.findById(

          req.params.id

        );


      // ====================================
      // NOT FOUND
      // ====================================
      if (!notification) {

        return res.status(404).json({

          success: false,

          message:
            "Notification not found",

        });

      }


      // ====================================
      // OWNER CHECK
      // ====================================
      if (

        notification.recipient.toString() !==

        req.user._id.toString()

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      // ====================================
      // SOFT DELETE
      // ====================================
      notification.deleted =
        true;

      await notification.save();


      // ====================================
      // RESPONSE
      // ====================================
      return res.status(200).json({

        success: true,

        message:
          "Notification deleted successfully",

      });

    }

    catch (error) {

      console.log(
        "DELETE NOTIFICATION ERROR:",
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
// DELETE ALL NOTIFICATIONS
// ==========================================
const deleteAllNotifications =
  async (req, res) => {

    try {

      await Notification.updateMany(

        {

          recipient:
            req.user._id,

        },

        {

          $set: {

            deleted: true,

          },

        }

      );


      return res.status(200).json({

        success: true,

        message:
          "All notifications deleted successfully",

      });

    }

    catch (error) {

      console.log(
        "DELETE ALL ERROR:",
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
// CREATE NOTIFICATION
// ==========================================
const createNotification =
  async ({

    recipient,

    sender = null,

    title,

    message,

    type = "system",

    priority = "medium",

    relatedId = null,

    actionLink = "",

    expiresAt = null,

    icon = "🔔",

  }) => {

    try {

      return await Notification.create({

        recipient,

        sender,

        title,

        message,

        type,

        priority,

        relatedId,

        actionLink,

        expiresAt,

        icon,

        isRead: false,

        delivered: false,

      });

    }

    catch (error) {

      console.log(

        "CREATE NOTIFICATION ERROR:",

        error

      );

      return null;

    }

  };


// ==========================================
// NOTIFICATION ANALYTICS
// ==========================================
const getNotificationAnalytics =
  async (req, res) => {

    try {

      const userId =
        new mongoose.Types.ObjectId(
          req.user._id
        );


      // ====================================
      // TOTAL COUNTS
      // ====================================
      const total =
        await Notification.countDocuments({

          recipient:
            userId,

          deleted: false,

        });

      const unread =
        await Notification.countDocuments({

          recipient:
            userId,

          isRead: false,

          deleted: false,

        });

      const read =
        await Notification.countDocuments({

          recipient:
            userId,

          isRead: true,

          deleted: false,

        });


      // ====================================
      // TYPE STATS
      // ====================================
      const typeStats =
        await Notification.aggregate([

          {

            $match: {

              recipient:
                userId,

              deleted: false,

            },

          },

          {

            $group: {

              _id:
                "$type",

              count: {

                $sum: 1,

              },

            },

          },

          {

            $sort: {

              count: -1,

            },

          },

        ]);


      // ====================================
      // PRIORITY STATS
      // ====================================
      const priorityStats =
        await Notification.aggregate([

          {

            $match: {

              recipient:
                userId,

              deleted: false,

            },

          },

          {

            $group: {

              _id:
                "$priority",

              count: {

                $sum: 1,

              },

            },

          },

          {

            $sort: {

              count: -1,

            },

          },

        ]);


      // ====================================
      // RESPONSE
      // ====================================
      return res.status(200).json({

        success: true,

        analytics: {

          total,

          unread,

          read,

          typeStats,

          priorityStats,

        },

      });

    }

    catch (error) {

      console.log(
        "ANALYTICS ERROR:",
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

  getNotifications,

  getUnreadCount,

  markNotificationRead,

  markAllNotificationsRead,

  deleteNotification,

  deleteAllNotifications,

  createNotification,

  getNotificationAnalytics,

};