const { User, Carer, Patient } = require("../models");
const mongoose = require("mongoose");
const sendNotification = require("./sendNotification");

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

const updateCarerReviews = async (_, { reviewInput, userId }) => {
  try {
    reviewInput.patientId = userId;

    const carer = await Carer.findOne({ userId: userId });
    const receiverId = carer.userId;

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
  updateCarerReviews,
};
