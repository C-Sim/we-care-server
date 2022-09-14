const { AuthenticationError, ApolloError } = require("apollo-server");
const { Notification } = require("../models");

const allNotifications = async () => {
  return await Notification.find();
};

const notificationsByUserId = async (_, __, { user }) => {
  return await Notification.find({ receiverId: user.id, isProcessed: false })
    .sort({ start: -1 })
    .populate("senderId");
};

const updateIsReadStatus = async (_, { notificationId }, { user }) => {
  try {
    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: notificationId },
      { $set: { isRead: true } },
      {
        new: true,
      }
    );

    const updatedReceivedNotifications = await Notification.find({
      receiverId: user.id,
    }).populate("senderId");

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
      // // if notificationType === "Carer change"
      // const trigger = "carerChange";

      // try {
      //   await updateAppointment({
      //     variables: {
      //       appointmentId,
      //       trigger,
      //       //   appointmentUpdateInput: { carerId, start, end },
      //     },
      //   });

      if (processNotificationInput.action === "APPROVE") {
        if (processNotificationInput.notificationType === "New patient") {
          await Notification.findOneAndUpdate(
            { _id: processNotificationInput.notificationId },
            { $set: { isProcessed: true } },
            {
              new: true,
            }
          );
        }

        const updatedReceivedNotifications = await Notification.find({
          receiverId: user.id,
          isProcessed: false,
        })
          .sort({ start: -1 })
          .populate("senderId");

        return updatedReceivedNotifications;
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
  processNotification,
};
