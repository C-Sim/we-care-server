const { User, Carer, Patient } = require("../models");

const carerInfo = async (_, { userId }) => {
  const carer = await Carer.findOne({ userId }).populate("userId");

  return carer;
};

const patientInfo = async (_, { userId }) => {
  const patient = await Patient.findOne({ userId }).populate("userId");

  return patient;
};

module.exports = { carerInfo, patientInfo };
