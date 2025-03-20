// models/index.js
const ActivityLog = require("./log.model");
const Department = require("./department.model");
const Attendance = require("./attendance.model");
const User = require("./user.model");
const Employee = require("./employee.model");

module.exports = {
  ActivityLog,
  Department,
  Attendance,
  User,
  Employee,
};
