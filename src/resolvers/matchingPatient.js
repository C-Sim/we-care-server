const { Carer, Patient } = require("../models");
const { getDay, parseISO } = require("date-fns");

const findPatientsByCarergender = async (_, { userId }) => {
  const carer = await Carer.findOne({ userId: userId });
  const { gender } = carer;

  const patients = await Patient.find({ gender: gender }).populate("userId");
  return patients;
};

const findPatientsByCarergenderAndDay = async (_, { userId, dayInput }) => {
  const daysList = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const date = parseISO(dayInput.date);

  const carer = await Carer.findOne({ userId: userId });
  const { gender } = carer;

  if (!date) {
    return await Patient.find({ gender: gender }).populate("userId");
  } else {
    const day = daysList[getDay(date)];
    const patients = await Patient.find({
      $and: [{ gender: gender }, { days: { $all: [day] } }],
    }).populate("userId");
    return patients;
  }
};

module.exports = { findPatientsByCarergender, findPatientsByCarergenderAndDay };
