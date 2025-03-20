"use strict";

const employeeRouter = require("./employee.router");
const userRouter = require("./user.router");
const employeeRouter = require("./employee.router");
const departmentRouter = require("./department.router");
const attendanceRouter = require("./attendance.router");
const notificationRouter = require("./notification.router");
const logRouter = require("./log.router");

module.exports = (app) => {
  const version = "/api/v1";

  app.use(version + "/employee", employeeRouter);
  app.use(version + "/user", userRouter);
  app.use(version + "/department", departmentRouter);
  app.use(version + "/attendance", attendanceRouter);
  app.use(version + "/notification", notificationRouter);
  app.use(version + "/logs", logRouter);
};
