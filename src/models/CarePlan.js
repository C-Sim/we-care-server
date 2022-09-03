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
      type: string,
      default: false,
    },
  ],
  mobility: [
    {
      type: string,
      default: false,
    },
  ],
  communication: [
    {
      type: string,
      default: false,
    },
  ],
  allergies: [
    {
      type: string,
      default: false,
    },
  ],
  personalCare: [
    {
      type: string,
      default: false,
    },
  ],
  mentalHealth: [
    {
      type: string,
      default: false,
    },
  ],
  dietaryRequirements: [
    {
      type: string,
      default: false,
    },
  ],
};

const schema = new Schema(carePlanSchema, {
  _id: false,
});

module.exports = schema;
