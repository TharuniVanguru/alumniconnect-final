const Notification =
  require(
    "../models/Notification"
  );


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
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 20;

      const skip =
        (page - 1) * limit;


      // ====================================
      // FILTERS
      // ====================================
      const filters = {

        recipient:
          req.user._id,

      };


      if (type) {

        filters.type = type;

      }


      if (
        isRead === "true"
      ) {

        filters.isRead = true;

      }

      else if (
        isRead === "false"
      ) {

        filters.isRead = false;

      }


      if (priority) {

        filters.priority =
          priority;

      }


      // ====================================
      // FETCH NOTIFICATIONS
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

          .limit(limit);


      // ====================================
      // COUNTS
      // ====================================
      const unreadCount =
        await Notification.countDocuments({

          recipient:
            req.user._id,

          isRead: false,

        });


      const total =
        await Notification.countDocuments(
          filters
        );


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

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

      res.status(500).json({

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


      const updatedNotification =
        await notification.save();


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        notification:
          updatedNotification,

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
// MARK ALL AS READ
// ==========================================
const markAllNotificationsRead =
  async (req, res) => {

    try {

      await Notification.updateMany(

        {

          recipient:
            req.user._id,

          isRead: false,

        },

        {

          $set: {

            isRead: true,

            readAt:
              new Date(),

          },

        }

      );


      res.status(200).json({

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

      res.status(500).json({

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
      // DELETE
      // ====================================
      await notification.deleteOne();


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

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

      res.status(500).json({

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

      await Notification.deleteMany({

        recipient:
          req.user._id,

      });


      res.status(200).json({

        success: true,

        message:
          "All notifications deleted successfully",

      });

    }

    catch (error) {

      console.log(
        "DELETE ALL NOTIFICATIONS ERROR:",
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
// CREATE NOTIFICATION
// INTERNAL HELPER
// ==========================================
const createNotification =
  async ({

    recipient,

    sender,

    title,

    message,

    type = "system",

    priority = "Medium",

    relatedId = null,

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

        isRead: false,

      });

    }

    catch (error) {

      console.log(

        "CREATE NOTIFICATION ERROR:",

        error

      );

    }

  };


// ==========================================
// NOTIFICATION ANALYTICS
// ==========================================
const getNotificationAnalytics =
  async (req, res) => {

    try {

      const total =
        await Notification.countDocuments({

          recipient:
            req.user._id,

        });

      const unread =
        await Notification.countDocuments({

          recipient:
            req.user._id,

          isRead: false,

        });

      const read =
        await Notification.countDocuments({

          recipient:
            req.user._id,

          isRead: true,

        });


      // ====================================
      // TYPE ANALYTICS
      // ====================================
      const typeStats =
        await Notification.aggregate([

          {

            $match: {

              recipient:
                req.user._id,

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

        ]);


      // ====================================
      // PRIORITY ANALYTICS
      // ====================================
      const priorityStats =
        await Notification.aggregate([

          {

            $match: {

              recipient:
                req.user._id,

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

        ]);


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

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

  getNotifications,

  markNotificationRead,

  markAllNotificationsRead,

  deleteNotification,

  deleteAllNotifications,

  createNotification,

  getNotificationAnalytics,

};