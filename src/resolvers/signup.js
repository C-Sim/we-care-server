const { AuthenticationError, ApolloError } = require("apollo-server");
const {
  User,
  Patient,
  Carer,
  Supervisor,
  Notification,
  AddressLookup,
} = require("../models");

const patientSignup = async (_, { signupInput, patientInput }) => {
  //add account type to signup input
  signupInput.accountType = "patient";

  // **START** - Part of signup as per PET_BNB_SERVER
  const email = signupInput.email;
  //check if user exists
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    console.log(
      `[ERROR]: Failed to signup | ${signupInput.email} already exists`
    );

    throw new ApolloError("Failed to signup");
  }

  const address = await AddressLookup.findOne({
    addresses: {
      $elemMatch: {
        _id: signupInput.address,
      },
    },
  });

  const yourAddress = address
    .get("addresses")
    .find((address) => address.get("_id")?.toString() === signupInput.address);

  //create user
  const user = await User.create({
    ...signupInput,
    address: yourAddress,
  });

  // **END** - Part of signup as per PET_BNB_SERVER

  //retrieve relevant info and add to patientInput
  patientInput.userId = user._id;
  patientInput.username = `${user.firstName} ${user.lastName}`;

  //create new patient
  const patient = await Patient.create(patientInput);

  //assign patient profile id to user field
  const patientProfileId = patient.id;
  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    {
      $set: { patientProfileId },
    },
    {
      new: true,
    }
  );

  //retrieve supervisor info
  const supervisor = await Supervisor.findOne({});
  const supervisorId = supervisor.userId;

  //create notification
  const notificationData = {
    receiverId: supervisorId,
    senderId: patient.userId,
    notificationType: "New patient review",
    notificationText:
      "New patient signup - Please review their profile and approve or decline the request.",
    apppointmentId: "null",
    apppointmentDate: "null",
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

  return { success: true };
};

const carerSignup = async (_, { signupInput, carerInput }, { user }) => {
  try {
    if (user.accountType === "supervisor") {
      //add account type to signup input
      signupInput.accountType = "carer";

      // **START** - Part of signup as per PET_BNB_SERVER
      //check if user exists
      const userExists = await User.findOne({ email: signupInput.email });

      if (userExists) {
        console.log(
          `[ERROR]: Failed to signup | ${signupInput.email} already exists`
        );

        throw new ApolloError("Failed to signup");
      }

      const address = await AddressLookup.findOne({
        addresses: {
          $elemMatch: {
            _id: signupInput.address,
          },
        },
      });

      const yourAddress = address
        .get("addresses")
        .find(
          (address) => address.get("_id").toString() === signupInput.address
        );

      //create user
      const user = await User.create({
        ...signupInput,
        address: yourAddress,
      });

      // **END** - Part of signup as per PET_BNB_SERVER

      //retrieve relevant info and add to carerInput
      carerInput.userId = user._id;
      carerInput.username = `${user.firstName} ${user.lastName}`;

      //create new patient
      const carer = await Carer.create(carerInput);

      //assign carer profile id to user field
      const carerProfileId = carer.id;
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: { carerProfileId },
        },
        {
          new: true,
        }
      );

      return {
        success: true,
        carer: carer,
        userId: carer.userId,
      };
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to create carer | ${error.message}`);

    throw new ApolloError("Failed to create carer");
  }
};

module.exports = { patientSignup, carerSignup };
