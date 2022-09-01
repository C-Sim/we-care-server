const { Notification } = require("../models");

const allNotificationsByUserId = async (_, { userId }) => {
  const notifications = await Notification.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  });
  return notifications;
};

const receivedNotificationsByUserId = async (_, { userId }) => {
  const notifications = await Notification.find({ receiverId: userId });
  return notifications;
};

const sentNotificationsByUserId = async (_, { userId }) => {
  const notifications = await Notification.find({ senderId: userId });
  return notifications;
};

module.exports = {
  allNotificationsByUserId,
  receivedNotificationsByUserId,
  sentNotificationsByUserId,
};
