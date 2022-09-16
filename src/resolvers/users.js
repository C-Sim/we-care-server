const { AuthenticationError, ApolloError } = require("apollo-server");
const { User, Patient, Carer } = require("../models");

//for future development - for supervisor - brings all the carers in the team
const carers = async (_, __, { user }) => {
  try {
    if (user && user.accountType === "supervisor") {
      const carers = await Carer.find({}).populate("userId");
      return carers;
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

//for future development - for supervisor - brings all the patients
const patients = async (_, __, { user }) => {
  try {
    if (user && user.accountType === "supervisor") {
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to proceed | ${error.message}`);
    return new ApolloError("Failed to proceed");
  }
  const patients = await Patient.find({}).populate("userId");
  return patients;
};

//for supervisor - when assigning carers and patients
const availableCarersByDate = async (_, { selectedDate }, { user }) => {
  try {
    if (user && user.accountType === "supervisor") {
      const rangeStart = new Date(selectedDate).setUTCHours(0, 0, 0);
      const rangeEnd = new Date(selectedDate).setUTCHours(23, 59, 0);

      const allCarers = await Carer.aggregate([
        {
          $lookup: {
            from: "appointments",
            let: {
              carerId: "$userId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $gt: ["$start", new Date(rangeStart)],
                      },
                      {
                        $lt: ["$end", new Date(rangeEnd)],
                      },
                      {
                        $eq: ["$$carerId", "$carerId"],
                      },
                    ],
                  },
                },
              },
            ],
            as: "appointments",
          },
        },
      ]);

      const availableCarers = allCarers.filter(
        (i) => i.appointments.length === 0
      );
      return availableCarers;
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

module.exports = { carers, patients, availableCarersByDate };
