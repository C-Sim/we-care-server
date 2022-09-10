const { Notification } = require("../models");

const allNotifications = async () => {
  return await Notification.find();
};

const notificationsByUserId = async (_, { userId, mailType }) => {
  switch (mailType) {
    case "sent":
      return await Notification.find({ senderId: userId });
    case "received":
      return await Notification.find({ receiverId: userId });
    case "all":
      return await Notification.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      });
  }
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
