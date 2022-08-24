const { Schema } = require("mongoose");
const { format } = require("date-fns");

const reviewSchema = {
  reviewDate: {
    type: Date,
    trim: true,
    default: new Date(),
    get: (val) => format(new Date(val), "yyyy-MM-dd"),
  },
  comment: {
    type: String,
  },
  score: {
    type: Number,
    trim: true,
    default: 3,
  },
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  carerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
};

const schema = new Schema(reviewSchema, {
  _id: false,
});

module.exports = schema;
