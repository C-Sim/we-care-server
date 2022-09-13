const { User, Patient, Carer } = require("../models");



const carers = async () => {
  const carers = await Carer.find({}).populate("userId");
  return carers;
};

const patients = async () => {
  const patients = await Patient.find({}).populate("userId");
  return patients;
};

const availableCarersByDate = async (_, { selectedDate }) => {
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

  const availableCarers = allCarers.filter((i) => i.appointments.length === 0);
  return availableCarers;
};

module.exports = { carers, patients, availableCarersByDate };
