const { Schema, Types, model } = require("mongoose");

const supervisorSchema = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  assignedCarers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Carer",
    },
  ],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
};

const schema = new Schema(
  supervisorSchema,
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } }
);

schema.virtual("carerCount").get(function () {
  return this.assignedCarers.length;
});
schema.virtual("notificationCount").get(function () {
  return this.notifications.length;
});

const Supervisor = model("Supervisor", schema);

module.exports = Supervisor;
