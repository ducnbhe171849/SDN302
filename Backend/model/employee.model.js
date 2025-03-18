const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Please enter a valid phone number"],
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    position: {
      type: String,
      required: true,
    },
    salary: {
      type: Schema.Types.ObjectId,
      ref: "Salary",
    },
    startDate: {
      type: Date,
      required: true,
    },
    avatar: {
      type: String, // URL đến ảnh đại diện
      required: true,
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
