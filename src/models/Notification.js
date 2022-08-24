const { Schema, Types, model } = require("mongoose");
const { format } = require("date-fns");

const notificationSchema = {
  notificationDate: {
    type: Date,
    required: true,
    trim: true,
    default: new Date(),
    get: (val) => format(new Date(val), "yyyy-MM-dd"),
  },
  isRead: {
    type: Boolean,
    required: true,
    default: false,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
  },
  notificationText: {
    type: String,
  },
};

const schema = new Schema(notificationSchema, {
  toJSON: { virtuals: true, getters: true },
});

const Notification = model("Notification", schema);

module.exports = Notification;
