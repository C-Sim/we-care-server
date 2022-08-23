const { Schema, Types, model } = require("mongoose");
const { format } = require("date-fns");
const reviewSchema = require("./Review");

const appointmentSchema = {
  appointmentDate: {
    type: Date,
    required: true,
    trim: true,
    get: (val) => format(new Date(val), "yyyy-MM-dd"),
  },
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
    trim: true,
    get: (val) => format(new Date(val), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  end: {
    type: Date,
    required: true,
    trim: true,
    get: (val) => format(new Date(val), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  status: {
    type: String,
    required: true,
    default: "not started",
  },
  actualStart: {
    type: Date,
    trim: true,
    get: (val) => format(new Date(val), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  actualEnd: {
    type: Date,
    trim: true,
    get: (val) => format(new Date(val), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  carerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notes: [
    {
      type: String,
    },
  ],
  patientReview: reviewSchema,
};

const schema = new Schema(appointmentSchema, {
  toJSON: { virtuals: true, getters: true },
});

schema.virtual("notesCount").get(function () {
  return this.notes.length;
});

const Appointment = model("Appointment", schema);

module.exports = Appointment;
