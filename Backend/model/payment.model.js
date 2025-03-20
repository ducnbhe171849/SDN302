const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    performBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetEmployee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    deductions: {
      type: Number,
      required: true,
    },
    bonus: {
      type: Number,
      required: true,
    },
    totalHoursWork: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("payment", paymentSchema);

module.exports = Payment;
