const { AuthenticationError, ApolloError } = require("apollo-server");
const { User, Appointment, Notification, Carer } = require("../models");

//for future development - for future reshaping of dashboard with more summary sections
const carerDashboard = async (_, __, { user }) => {
  try {
    if (user) {
      const carer = await (
        await Carer.findOne({ userId: { _id: user.id } })
      ).populate("userId");

      const appointments = await Appointment.find({
        $or: [{ carerId: user.id }, { patientId: user.id }],
      })
        .populate("carerId")
        .populate("patientId");

      const notifications = await Notification.find({
        $or: [{ senderId: user.id }, { receiverId: user.id }],
      });

      return { carer, appointments, notifications };
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    return new ApolloError("Failed to proceed");
  }
};

module.exports = carerDashboard;
