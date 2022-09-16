const { AuthenticationError, ApolloError } = require("apollo-server");
const { User, Appointment, Notification, Patient } = require("../models");

//for future development - for future reshaping of dashboard with more summary sections
const patientDashboard = async (_, __, { user }) => {
  try {
    if (user) {
      const patient = await (
        await Patient.findOne({ userId: { _id: user.id } })
      ).populate("userId");

      const appointments = await Appointment.find({
        $or: [{ carerId: user.id }, { patientId: user.id }],
      })
        .populate("carerId")
        .populate("patientId");

      const notifications = await Notification.find({
        $or: [{ senderId: user.id }, { receiverId: user.id }],
      });

      return { patient, appointments, notifications };
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

module.exports = patientDashboard;
