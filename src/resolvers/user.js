const { AuthenticationError, ApolloError } = require("apollo-server");
const { User, Carer, Patient, AddressLookup } = require("../models");
const mongoose = require("mongoose");
const sendNotification = require("./sendNotification");

//for a user to be able to recall their user account info
const userInfo = async (_, __, { user }) => {
  try {
    if (user) {
      const user = await User.findById(user.id);

      return user;
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to proceed | ${error.message}`);
    return new ApolloError("Failed to proceed");
  }
};

//for a carer to recall their carer specific info
const carerInfo = async (_, __, { user }) => {
  try {
    if (user.accountType === "carer") {
      const carer = await Carer.findOne({ userId: user.id }).populate("userId");

      return carer;
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to proceed | ${error.message}`);
    return new ApolloError("Failed to proceed");
  }
};

//the carer will query for patient info here
const patientInfo = async (_, { userId }, { user }) => {
  try {
    if (user.accountType === "carer") {
      const patient = await Patient.findOne({ userId: userId }).populate(
        "userId"
      );

      return patient;
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to proceed | ${error.message}`);
    return new ApolloError("Failed to proceed");
  }
};

//for users to be able to update their info
const updateUserInfo = async (_, { updateInput }, { user }) => {
  try {
    if (user) {
      if (updateInput.address) {
        const address = await AddressLookup.findOne({
          addresses: {
            $elemMatch: {
              _id: updateInput.address,
            },
          },
        });

        const yourAddress = address
          .get("addresses")
          .find(
            (address) => address.get("_id")?.toString() === updateInput.address
          );

        updateInput.address = yourAddress;
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: user.id },
        { $set: updateInput },
        {
          new: true,
        }
      );

      return {
        success: true,
        user: updatedUser,
      };
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to update user | ${error.message}`);
    return new ApolloError("Failed to proceed");
  }
};

//for future development - for carers to be able to update their carer specific info
const updateCarerInfo = async (_, { updateCarerInput }, { user }) => {
  try {
    const updatedCarer = await Carer.findOneAndUpdate(
      { userId: user.id },
      { $set: updateCarerInput },
      {
        new: true,
      }
    );

    return {
      success: true,
      userId: user.id,
    };
  } catch (error) {
    console.log(`[ERROR]: Failed to update carer | ${error.message}`);
    return new ApolloError("Failed to proceed");
  }
};

//for patients to be able to update their patient specific info
const updatePatientInfo = async (_, { updatePatientInput }, { user }) => {
  try {
    if (user) {
      const updatedPatient = await Patient.findOneAndUpdate(
        { userId: user.id },
        { $set: updatePatientInput },
        {
          new: true,
        }
      );

      return {
        success: true,
        userId: user.id,
      };
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to update patient | ${error.message}`);
    return new ApolloError("Failed to proceed");
  }
};

//for supervisor to approve a new patient after signup
const updateApprovedStatus = async (_, { userId }, { user }) => {
  try {
    if (user.accountType === "supervisor") {
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
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to update patient | ${error.message}`);
    return new ApolloError("Failed to proceed");
  }
};

//for future development - for patients to be able to review their regular carer
const updateCarerReviews = async (_, { reviewInput }, { user }) => {
  try {
    if (user.accountType === "patient") {
      reviewInput.patientId = user.id;

      const carer = await Carer.findOne({ userId: user.id });
      const receiverId = carer.user.id;

      //push the review in the carer's reviews array
      carer.reviews.push(reviewInput);
      const updatedCarer = await carer.save();

      //notify the carer that they have a new review
      const carerNotified = await sendNotification({
        receiverType: "carer",
        receiverId,
        notificationType: "New review",
        notificationText:
          "You received a new review from one of your patients.",
      });

      return {
        success: true,
        userId: user.id,
      };
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to update patient | ${error.message}`);
    return new ApolloError("Failed to proceed");
  }
};

module.exports = {
  userInfo,
  carerInfo,
  patientInfo,
  updateUserInfo,
  updateCarerInfo,
  updatePatientInfo,
  updateApprovedStatus,
  updateCarerReviews,
};
