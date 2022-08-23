const { Schema, Types, model } = require("mongoose");
const reviewSchema = require("./Review");
const Address = require("./Address");

const carerSchema = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  postcode: {
    type: String,
    required: true,
  },
  address: {
    type: Address,
  },
  days: [
    {
      type: String,
      required: true,
    },
  ],
  sex: {
    type: String,
    required: true,
  },
  appointments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  reviews: [reviewSchema],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
};

const schema = new Schema(
  carerSchema,
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } }
);

schema.virtual("appointmentCount").get(function () {
  return this.appointments.length;
});

schema.virtual("notificationCount").get(function () {
  return this.notifications.length;
});

const Carer = model("Carer", schema);

module.exports = Carer;
