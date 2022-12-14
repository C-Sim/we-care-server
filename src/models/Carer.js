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
  days: [
    {
      type: String,
      required: true,
    },
  ],
  gender: {
    type: String,
    enum: ["male", "female"],
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

const schema = new Schema(carerSchema, { toJSON: { virtuals: true } });

schema.virtual("appointmentCount").get(function () {
  return this.appointments.length;
});

schema.virtual("notificationCount").get(function () {
  return this.notifications.length;
});

const Carer = model("Carer", schema);

module.exports = Carer;
