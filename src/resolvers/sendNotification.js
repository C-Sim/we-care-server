const { AuthenticationError, ApolloError } = require("apollo-server");
const {
  Patient,
  Carer,
  Supervisor,
  Notification,
  Appointment,
} = require("../models");

//function to process the creation of a notification and allocation of notification id to the correct parties
const sendNotification = async ({
  senderId,
  receiverType,
  receiverId,
  notificationType,
  notificationText,
  appointmentId,
}) => {
  try {
    let reviewedAppointmentId;
    let reviewedAppointmentDate;
    if (!appointmentId) {
      reviewedAppointmentId = "null";
      reviewedAppointmentDate = "null";
    } else {
      const appointment = await Appointment.findById(appointmentId).populate(
        "patientId"
      );
      reviewedAppointmentId = appointmentId;
      reviewedAppointmentDate = appointment.appointmentDate;
      reviewedPatientUsername = ` ${appointment.patientId.firstName} ${appointment.patientId.lastName}`;
    }

    //create notification data
    const notificationData = {
      senderId,
      receiverId,
      notificationType,
      notificationText,
      appointmentId: reviewedAppointmentId,
      appointmentDate: reviewedAppointmentDate,
      patientUsername: reviewedPatientUsername,
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

    if (receiverType === "supervisor") {
      //add notification into the supervisor's notifications array
      const notificationArrayUpdate = await Supervisor.findOneAndUpdate(
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
