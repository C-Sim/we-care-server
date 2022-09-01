const { Appointment } = require("../models");

const allAppointments = async () => {
  const appointments = await Appointment.find({});
  return appointments;
};

const appointmentsByUserId = async (_, { userId }) => {
  const appointments = await Appointment.find({
    $or: [{ carerId: userId }, { patientId: userId }],
  });
  return appointments;
};

module.exports = { allAppointments, appointmentsByUserId };
