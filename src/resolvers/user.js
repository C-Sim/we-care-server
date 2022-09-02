const { User, Carer, Patient } = require("../models");
const mongoose = require("mongoose");

const carerInfo = async (_, { userId }) => {
  const carer = await Carer.findOne({ userId }).populate("userId");

  return carer;
};

const patientInfo = async (_, { userId }) => {
  const patient = await Patient.findOne({ userId }).populate("userId");

  return patient;
};

const updateCarerInfo = async (_, { updateInput, userId }) => {
  try {
    const updatedCarer = await Carer.findOneAndUpdate(
      { userId: userId },
      { $set: updateInput },
      {
        new: true,
      }
    );

    return {
      success: true,
      userId: userId,
    };
  } catch (error) {
    console.log(`[ERROR]: Failed to update carer | ${error.message}`);
  }
};

const updatePatientInfo = async (_, { updateInput, userId }) => {
  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { userId: userId },
      { $set: updateInput },
      {
        new: true,
      }
    );

    return {
      success: true,
      userId: userId,
    };
  } catch (error) {
    console.log(`[ERROR]: Failed to update patient | ${error.message}`);
  }
};

const updateApprovedStatus = async (_, { userId }) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { approvedStatus: true } },
      {
        new: true,
      }
    );

    return {
      success: true,
      userId: userId,
    };
  } catch (error) {
    console.log(`[ERROR]: Failed to update patient | ${error.message}`);
  }
};

module.exports = {
  carerInfo,
  patientInfo,
  updateCarerInfo,
  updatePatientInfo,
  updateApprovedStatus,
};
