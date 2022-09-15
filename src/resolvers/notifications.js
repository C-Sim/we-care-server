const { AuthenticationError, ApolloError } = require("apollo-server");
const { Notification } = require("../models");

const allNotifications = async () => {
  return await Notification.find();
};

const notificationsByUserId = async (_, __, { user }) => {
  return await Notification.find({ receiverId: user.id })
    .sort({ start: -1 })
    .populate("senderId");
};

const updateIsReadStatus = async (_, { notificationId }, { user }) => {
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
      receiverId: user.id,
    });

    return updatedReceivedNotifications;
  } catch (error) {
    console.log(
      `[ERROR]: Failed to update notification status | ${error.message}`
    );
  }
};

const processNotification = async (
  _,
  { processNotificationInput },
  { user }
) => {
  try {
    if (user) {
      if (processNotificationInput.notificationType === "New patient review") {
        console.log("YO YO");
        return [];
      }
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to process notification | ${error.message}`);
    return new ApolloError("Failed to process notification");
  }
};

module.exports = {
  notificationsByUserId,
  updateIsReadStatus,
  allNotifications,
};
