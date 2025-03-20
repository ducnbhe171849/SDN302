const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    targetDepartment: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
