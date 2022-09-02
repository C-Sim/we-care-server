const { User, Patient, Carer } = require("../models");

const users = async () => {
  const users = await User.find({});
  return users;
};

const carers = async () => {
  const carers = await Carer.find({}).populate("userId");
  return carers;
};

const patients = async () => {
  const patients = await Patient.find({}).populate("userId");
  return patients;
};

module.exports = { users, carers, patients };
