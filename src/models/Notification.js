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
  notificationType: {
    type: String,
    enum: [
      "Schedule change",
      "Carer change",
      "New patient",
      "New care requirement",
      "Update",
      "New review",
    ],
    default: "Update",
  },
  isRead: {
    type: Boolean,
    required: true,
    default: false,
  },
  isProcessed: {
    type: Boolean,
    default: false,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appointmentId: {
    type: String,
  },
  appointmentDate: {
    type: String,
  },
  patientUsername: {
    type: String,
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
