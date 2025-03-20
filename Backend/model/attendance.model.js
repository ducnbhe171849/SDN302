const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },
    hoursWorked: {
      type: Number,
      default: 8, // Số giờ làm việc mặc định trong một ngày
    },
    overTime: {
      type: Number,
    },

    pay: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
