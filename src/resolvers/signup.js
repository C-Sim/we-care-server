const { ApolloError } = require("apollo-server");
const { User, Patient, Supervisor, Notification } = require("../models");

const patientSignup = async (_, { signupInput, patientInput }) => {
  try {
    //   //create user
    //   //check if we get the user id back after creation
    const user = await User.create(signupInput);

    patientInput.userId = user._id;

    //create new patient (and making sure to pass userId in the patientInput)
    const patient = await Patient.create(patientInput);

    //create notification to supervisor so they can approve them as a new patient
    const supervisor = await Supervisor.findOne({});
    const supervisorId = supervisor.id;

    const notificationData = {
      receiverId: supervisorId,
      senderId: patient.userId,
      notificationText:
        "New patient signup - Your action: review and approve profile",
    };

    //check how we pass supervisor id and patient id
    await Notification.create(notificationData);

    return {
      success: true,
      patient: patient,
      userId: patient.userId,
    };
  } catch (error) {
    console.log(`[ERROR]: Failed to create patient | ${error.message}`);

    throw new ApolloError("Failed to create patient");
  }
};

module.exports = { patientSignup };
