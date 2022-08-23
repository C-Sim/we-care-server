const { Schema } = require("mongoose");
const { format } = require("date-fns");

const resourceSchema = {
  addedDate: {
    type: Date,
    trim: true,
    default: new Date(),
    get: (val) => format(new Date(val), "yyyy-MM-dd"),
  },
  organisation: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
  },
  resourceUrl: {
    type: String,
  },
  resourceInfo: {
    type: String,
  },
};

const schema = new Schema(resourceSchema, {
  _id: false,
});

module.exports = schema;
