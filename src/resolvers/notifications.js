const { AuthenticationError, ApolloError } = require("apollo-server");
const { Notification } = require("../models");

//for future development - for supervisor team analysis
const allNotifications = async (_, __, { user }) => {
  try {
    if (user.accountType === "supervisor") {
      return await Notification.find();
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to proceed | ${error.message}`);
    return new ApolloError("Failed to proceed");
  }
};

const notificationsByUserId = async (_, __, { user }) => {
  try {
    if (user) {
      return await Notification.find({ receiverId: user.id })
        .sort({ start: -1 })
        .populate("senderId");
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to proceed | ${error.message}`);
    return new ApolloError("Failed to proceed");
  }
};

const unreadNotificationsByUserId = async (_, __, { user }) => {
  try {
    if (user) {
      const unreadNotifications = await Notification.find({
        $and: [{ receiverId: user.id }, { isRead: false }],
      });
      const notifCount = unreadNotifications.length;
      return { unreadCount: notifCount };
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to proceed | ${error.message}`);
    return new ApolloError("Failed to proceed");
  }
};

const updateIsReadStatus = async (_, { notificationId }, { user }) => {
  try {
    if (user) {
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
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(
      `[ERROR]: Failed to update notification status | ${error.message}`
    );
    return new ApolloError("Failed to process notification");
  }
};

const updateIsProcessedStatus = async (_, { notificationId }, { user }) => {
  try {
    if (user) {
      const notification = await Notification.findById(notificationId);

      const updatedNotification = await Notification.findOneAndUpdate(
        { _id: notificationId },
        { $set: { isProcessed: true } },
        {
          new: true,
        }
      );

      const updatedReceivedNotifications = await Notification.find({
        receiverId: user.id,
      });

      return updatedReceivedNotifications;
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(
      `[ERROR]: Failed to update notification processed status | ${error.message}`
    );
    return new ApolloError("Failed to process notification");
  }
};

module.exports = {
  notificationsByUserId,
  updateIsReadStatus,
  updateIsProcessedStatus,
  allNotifications,
  unreadNotificationsByUserId,
};
