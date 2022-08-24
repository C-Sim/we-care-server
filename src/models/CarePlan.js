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
      trim: true,
    },
  ],
  carePlanText: {
    type: String,
  },
  additionalInfo: {
    type: String,
  },
};

const schema = new Schema(carePlanSchema, {
  _id: false,
});

module.exports = schema;
