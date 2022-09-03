const { ApolloError } = require("apollo-server");
const { User, Patient, Carer, Supervisor, Notification } = require("../models");

const patientSignup = async (_, { signupInput, patientInput }) => {
  try {
    //add account type to signup input
    signupInput.accountType = "patient";

    //create user
    const user = await User.create(signupInput);
    //retrieve relevant info and add to patientInput
    patientInput.userId = user._id;
    patientInput.username = `${user.firstName} ${user.lastName}`;

    //create new patient
    const patient = await Patient.create(patientInput);

    //retrieve supervisor info
    const supervisor = await Supervisor.findOne({});
    const supervisorId = supervisor.userId;

    //create notification
    const notificationData = {
      receiverId: supervisorId,
      senderId: patient.userId,
      notificationText:
        "New patient signup - Your action: review and approve profile",
    };

    const newNotification = await Notification.create(notificationData);

    //add notification into the supervisor's notifications array
    const notificationId = newNotification._id;

    const notificationArrayUpdate = await Supervisor.findOneAndUpdate(
      { userId: supervisorId },
      {
        $push: {
          notifications: notificationId,
        },
      }
    );

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

const carerSignup = async (_, { signupInput, carerInput }) => {
  try {
    //add account type to signup input
    signupInput.accountType = "carer";

    //create user
    const user = await User.create(signupInput);

    //retrieve relevant info and add to carerInput
    carerInput.userId = user._id;
    carerInput.username = `${user.firstName} ${user.lastName}`;

    //create new patient
    const carer = await Carer.create(carerInput);

    return {
      success: true,
      carer: carer,
      userId: carer.userId,
    };
  } catch (error) {
    console.log(`[ERROR]: Failed to create carer | ${error.message}`);

    throw new ApolloError("Failed to create carer");
  }
};

module.exports = { patientSignup, carerSignup };
