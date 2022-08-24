const { User, Appointment, Notification, Carer } = require("../models");

const carerDashboard = async (_, { userId }) => {
  const carer = await (
    await Carer.findOne({ userId: { _id: userId } })
  ).populate("userId");

  const appointments = await Appointment.find({
    $or: [{ carerId: userId }, { patientId: userId }],
  });

  const notifications = await Notification.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  });

  return { carer, appointments, notifications };
};

module.exports = carerDashboard;
