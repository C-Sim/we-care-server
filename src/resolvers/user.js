const { User, Carer, Patient, AddressLookup } = require("../models");
const mongoose = require("mongoose");
const sendNotification = require("./sendNotification");

const userInfo = async (_, __, { user }) => {
  const carer = await User.findById(user.id);

  return carer;
};

const carerInfo = async (_, __, { user }) => {
  const carer = await Carer.findOne({ userId: user.id }).populate("userId");

  return carer;
};

//the carer will query for patient info here
const patientInfo = async (_, { userId }) => {
  const patient = await Patient.findOne({ userId: userId }).populate("userId");

  return patient;
};

const updateUserInfo = async (_, { updateInput }, { user }) => {
  try {
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
  } catch (error) {
    console.log(`[ERROR]: Failed to update user | ${error.message}`);
  }
};

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
  }
};

const updatePatientInfo = async (_, { updatePatientInput }, { user }) => {
  try {
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

const updateCarerReviews = async (_, { reviewInput }, { user }) => {
  try {
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
      notificationText: "You received a new review from one of your patients.",
    });

    return {
      success: true,
      userId: user.id,
    };
  } catch (error) {
    console.log(`[ERROR]: Failed to update patient | ${error.message}`);
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
