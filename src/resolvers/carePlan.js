const { ApolloError } = require("apollo-server");
const { Patient } = require("../models");

//used by patients to add care requirements
const createCarePlan = async (_, { carePlanInput }, { user }) => {
  try {
    // const carePlanId = Patient.userId;
    const patient = await Patient.findOne({ userId: user.id });
    patient.carePlan = carePlanInput;
    const updatedPatient = await patient.save();
    return {
      success: true,
    };
  } catch (error) {
    console.log(`[ERROR]: Failed to Create Care Plan | ${error.message}`);

    throw new ApolloError("Failed to Create Care Plan");
  }
};

module.exports = {
  createCarePlan,
};
