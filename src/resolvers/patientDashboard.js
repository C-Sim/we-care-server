const { User, Appointment, Notification, Patient } = require("../models");

const patientDashboard = async (_, { userId }) => {
  const patient = await (
    await Patient.findOne({ userId: { _id: userId } })
  ).populate("userId");

  const appointments = await Appointment.find({
    $or: [{ carerId: userId }, { patientId: userId }],
  });

  const notifications = await Notification.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  });

  return { patient, appointments, notifications };
};

module.exports = patientDashboard;
