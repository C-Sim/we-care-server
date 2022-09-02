const { Notification } = require("../models");

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

module.exports = {
  notificationsByUserId,
};
