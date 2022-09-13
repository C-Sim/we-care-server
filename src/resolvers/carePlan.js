const { ApolloError } = require("apollo-server");
const { Patient } = require("../models");

const createCarePlan = async (_, { carePlanInput }, { user }) => {
  try {
    // const carePlanId = Patient.userId;
    const patient = await Patient.findOne({ userId: user.id });
    patient.carePlan = carePlanInput;
    const updatedPatient = await patient.save();
    return {
      success: true,
      id: user.id,
    };
  } catch (error) {
    console.log(`[ERROR]: Failed to Create Care Plan | ${error.message}`);

    throw new ApolloError("Failed to Create Care Plan");
  }
};

module.exports = {
  createCarePlan,
};
