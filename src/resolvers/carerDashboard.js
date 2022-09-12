const { User, Appointment, Notification, Carer } = require("../models");

const carerDashboard = async (_, __, { user }) => {
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
};

module.exports = carerDashboard;
