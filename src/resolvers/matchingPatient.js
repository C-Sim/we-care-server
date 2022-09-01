const { Carer, Patient } = require("../models");
const { getDay, parseISO } = require("date-fns");

const findPatientsByCarerGender = async (_, { userId }) => {
  const carer = await Carer.findOne({ userId: userId });
  const { gender } = carer;

  const patients = await Patient.find({
    genderPreference: { $in: [gender, "none"] },
  }).populate("userId");
  return patients;
};

const findPatientsByCarerGenderAndDay = async (_, { userId, dayInput }) => {
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
    return await Patient.find({
      genderPreference: { $in: [gender, "none"] },
    }).populate("userId");
  } else {
    const day = daysList[getDay(date)];
    const patients = await Patient.find({
      $and: [
        {
          genderPreference: { $in: [gender, "none"] },
        },
        { days: { $all: [day] } },
      ],
    }).populate("userId");
    return patients;
  }
};

module.exports = { findPatientsByCarerGender, findPatientsByCarerGenderAndDay };
