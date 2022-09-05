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
      default: "None",
    },
  ],
  mobility: [
    {
      type: String,
      default: "None",
    },
  ],
  communication: [
    {
      type: String,
      default: "None",
    },
  ],
  allergies: [
    {
      type: String,
      default: "None",
    },
  ],
  personalCare: [
    {
      type: String,
      default: "None",
    },
  ],
  mentalHealth: [
    {
      type: String,
      default: "None",
    },
  ],
  dietaryRequirements: [
    {
      type: String,
      default: "None",
    },
  ],
};

const schema = new Schema(carePlanSchema, {
  _id: false,
});

module.exports = schema;
