const Notification = require(
  "../models/Notification"
);


// @desc    Get Notifications
// @route   GET /notifications
// @access  Private

const getNotifications =
  async (req, res) => {

    try {

      const notifications =
        await Notification.find({
          recipient:
            req.user._id,
        })
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        notifications
      );

    }

    catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }

  };


// @desc    Mark Notification Read
// @route   PUT /notifications/:id/read
// @access  Private

const markNotificationRead =
  async (req, res) => {

    try {

      const notification =
        await Notification.findById(
          req.params.id
        );

      if (!notification) {

        return res.status(404).json({
          message:
            "Notification not found",
        });

      }

      // OWNER ONLY
      if (
        notification.recipient.toString() !==
        req.user._id.toString()
      ) {

        return res.status(403).json({
          message:
            "Not authorized",
        });

      }

      notification.isRead = true;

      const updatedNotification =
        await notification.save();

      res.status(200).json(
        updatedNotification
      );

    }

    catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }

  };


module.exports = {
  getNotifications,
  markNotificationRead,
};