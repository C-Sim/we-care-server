const { Appointment } = require("../models");

const appointments = async () => {
  const appointments = await Appointment.find({});
  return appointments;
};

module.exports = appointments;
