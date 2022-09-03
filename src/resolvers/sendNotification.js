const { ApolloError } = require("apollo-server");
const { Patient, Carer, Supervisor, Notification } = require("../models");

const sendNotification = async ({
  receiverType,
  receiverId,
  type,
  notificationText,
  appointmentId,
}) => {
  try {
    //create notification data
    const notificationData = {
      receiverId,
      type,
      notificationText,
      appointmentId,
    };

    //create notification
    const newNotification = await Notification.create(notificationData);
    //get notification id
    const notificationId = newNotification._id;

    if (receiverType === "carer") {
      //add notification into the carer's notifications array
      const notificationArrayUpdate = await Carer.findOneAndUpdate(
        { userId: receiverId },
        {
          $push: {
            notifications: notificationId,
          },
        }
      );
      return {
        success: true,
      };
    }

    if (receiverType === "patient") {
      //add notification into the patient's notifications array
      const notificationArrayUpdate = await Patient.findOneAndUpdate(
        { userId: receiverId },
        {
          $push: {
            notifications: notificationId,
          },
        }
      );
      return {
        success: true,
      };
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to send notification | ${error.message}`);

    throw new ApolloError("Failed to send notification");
  }
};

module.exports = sendNotification;
