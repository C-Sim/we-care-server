const { AuthenticationError, ApolloError } = require("apollo-server");
const { Carer, Patient } = require("../models");
const { getDay, parseISO } = require("date-fns");

//for future developments - for supervisor team analysis
const findPatientsByCarerGender = async (_, { userId }, { user }) => {
  try {
    if (user.accountType === "supervisor") {
      const carer = await Carer.findOne({ userId: userId });
      const { gender } = carer;

      const patients = await Patient.find({
        genderPreference: { $in: [gender, "none"] },
      }).populate("userId");
      return patients;
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

//for supervisor in assigning process - passing the carer id
const availablePatientsByCarerGenderAndDay = async (
  _,
  { selectedDate, userId },
  { user }
) => {
  try {
    if (user.accountType === "supervisor") {
      const daysList = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];

      //getting day of the week for the selected date
      const date = parseISO(selectedDate);
      const day = daysList[getDay(date)];

      //getting carer gender
      const carer = await Carer.findOne({ userId: userId });
      const { gender } = carer;

      //getting start and end of the day for check on availability (appointment already assigned or not)
      const rangeStart = new Date(selectedDate).setUTCHours(0, 0, 0);
      const rangeEnd = new Date(selectedDate).setUTCHours(23, 59, 0);

      const allPatients = await Patient.aggregate([
        {
          $match: {
            $and: [
              {
                genderPreference: { $in: [gender, "none"] },
              },
              { days: { $all: [day] } },
            ],
          },
        },
        {
          $lookup: {
            from: "appointments",
            let: {
              patientId: "$userId",
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
                        $eq: ["$$patientId", "$patientId"],
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

      const availablePatients = allPatients.filter(
        (i) => i.appointments.length === 0
      );
      return availablePatients;
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

module.exports = {
  findPatientsByCarerGender,
  availablePatientsByCarerGenderAndDay,
};
