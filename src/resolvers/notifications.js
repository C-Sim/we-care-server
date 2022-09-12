const { Notification } = require("../models");

const allNotifications = async () => {
  return await Notification.find();
};

const notificationsByUserId = async (_, __, { user }) => {
  return await Notification.find({ receiverId: user.id });
};

const updateIsReadStatus = async (_, { notificationId, userId }) => {
  try {
    const notification = await Notification.findById(notificationId);

    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: notificationId },
      { $set: { isRead: true } },
      {
        new: true,
      }
    );

    const updatedReceivedNotifications = await Notification.find({
      receiverId: userId,
    });

    return updatedReceivedNotifications;
  } catch (error) {
    console.log(
      `[ERROR]: Failed to update notification status | ${error.message}`
    );
  }
};

module.exports = {
  notificationsByUserId,
  updateIsReadStatus,
  allNotifications,
};
