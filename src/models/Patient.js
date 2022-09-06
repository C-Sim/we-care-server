const { Schema, model } = require("mongoose");
const carePlanSchema = require("./CarePlan");
const resourceSchema = require("./Resource");
const Address = require("./Address");

const patientSchema = {
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
  genderPreference: {
    type: String,
    enum: ["male", "female", "none"],
    default: "none",
  },
  isPremiumMember: {
    type: Boolean,
    required: true,
    default: false,
  },
  appointments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  carePlan: carePlanSchema,
  favouriteResources: [resourceSchema],
};

const schema = new Schema(patientSchema, { toJSON: { virtuals: true } });

schema.virtual("appointmentCount").get(function () {
  return this.appointments.length;
});

schema.virtual("notificationCount").get(function () {
  return this.notifications.length;
});

const Patient = model("Patient", schema);

module.exports = Patient;
