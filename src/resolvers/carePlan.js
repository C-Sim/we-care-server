const { ApolloError } = require("apollo-server");
const { Patient } = require("../models");

const createCarePlan = async (_, { carePlanInput, userId }) => {
  try {
    // const carePlanId = Patient.userId;
    const patient = await Patient.findOne({ userId: userId });
    patient.carePlan = carePlanInput;
    const updatedPatient = await patient.save();
    return {
      success: true,
      id: userId,
    };
  } catch (error) {
    console.log(`[ERROR]: Failed to Create Care Plan | ${error.message}`);

    throw new ApolloError("Failed to Create Care Plan");
  }
};

module.exports = {
  createCarePlan,
};
