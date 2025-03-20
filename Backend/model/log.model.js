const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activityLogSchema = new Schema(
  {
    action: {
      type: String,
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    details: {
      type: String,
    },
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
