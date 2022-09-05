const { Schema } = require("mongoose");
const { format } = require("date-fns");

const carePlanSchema = {
  creationDate: {
    type: Date,
    trim: true,
    default: new Date(),
    get: (val) => format(new Date(val), "yyyy-MM-dd"),
  },
  designatedPerson: {
    type: String,
  },
  disabilities: [
    {
      type: String,
      require: true,
    },
  ],
  mobility: [
    {
      type: String,
      require: true,
    },
  ],
  communication: [
    {
      type: String,
      require: true,
    },
  ],
  allergies: [
    {
      type: String,
      require: true,
    },
  ],
  personalCare: [
    {
      type: String,
      require: true,
    },
  ],
  mentalHealth: [
    {
      type: String,
      require: true,
    },
  ],
  dietaryRequirements: [
    {
      type: String,
      require: true,
    },
  ],
};

const schema = new Schema(carePlanSchema, {
  _id: false,
});

module.exports = schema;
