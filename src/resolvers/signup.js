const { ApolloError } = require("apollo-server");
const { User, Patient } = require("../models");

const signup = async (_, { signupInput }) => {
  try {
    //create user
    //check if we get the user id back after creation
    await User.create(signupInput);

    return {
      success: true,
    };
  } catch (error) {
    console.log(`[ERROR]: Failed to sign up | ${error.message}`);

    throw new ApolloError("Failed to sign up");
  }
};

const patientApprove = async (_, { patientInput }) => {
  try {
    //create patient
    //check if we get new patient id back after creating
    const patient = await Patient.create(patientInput);

    //create notification to supervisor so they can approve them as a new patient
    //check how we pass supervisor id and patient id
    await Notification.create(patient);

    return {
      success: true,
    };
  } catch (error) {
    console.log(`[ERROR]: Failed to create patient | ${error.message}`);

    throw new ApolloError("Failed to create patient");
  }
};

module.exports = { signup, patientApprove };
