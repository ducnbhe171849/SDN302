const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salarySchema = new Schema(
  {
    baseSalary: {
      type: Number,
      required: true,
      default: 0,
    },
    bonuses: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    totalSalary: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Salary = mongoose.model("Salary", salarySchema);

module.exports = Salary;

/**
 * ====================================
 *
 *
 * 1 month 160h
 *
 * salaryRatio = total work / 160 * 60
 *
 * total day present and total hour work
 *
 * 160 * 60  - total work = ??
 * < 0 phat - 150% * total
 * > 0  150% salary  + total
 *
 * ====================================
 */
