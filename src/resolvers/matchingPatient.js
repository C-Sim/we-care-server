const { Carer, Patient } = require("../models");
const { getDay, parseISO } = require("date-fns");

const findPatientsByCarerSex = async (_, { userId }) => {
  const carer = await Carer.findOne({ userId: userId });
  const { sex } = carer;

  const patients = await Patient.find({ sex: sex }).populate("userId");
  return patients;
};

const findPatientsByCarerSexAndDay = async (_, { userId, dayInput }) => {
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
  const { sex } = carer;

  if (!date) {
    return await Patient.find({ sex: sex }).populate("userId");
  } else {
    const day = daysList[getDay(date)];
    const patients = await Patient.find({
      $and: [{ sex: sex }, { days: { $all: [day] } }],
    }).populate("userId");
    return patients;
  }
};

module.exports = { findPatientsByCarerSex, findPatientsByCarerSexAndDay };
