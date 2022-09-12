const { User, Appointment, Notification, Patient } = require("../models");

const patientDashboard = async (_, __, { user }) => {
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
};

module.exports = patientDashboard;
