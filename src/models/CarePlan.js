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
      default: false,
    },
  ],
  mobility: [
    {
      type: String,
      default: false,
    },
  ],
  communication: [
    {
      type: String,
      default: false,
    },
  ],
  allergies: [
    {
      type: String,
      default: false,
    },
  ],
  personalCare: [
    {
      type: String,
      default: false,
    },
  ],
  mentalHealth: [
    {
      type: String,
      default: false,
    },
  ],
  dietaryRequirements: [
    {
      type: String,
      default: false,
    },
  ],
};

const schema = new Schema(carePlanSchema, {
  _id: false,
});

module.exports = schema;
