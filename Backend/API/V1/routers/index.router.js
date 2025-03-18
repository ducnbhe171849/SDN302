"use strict";

const employeeRouter = require("./employee.router");
const userRouter = require("./user.router");
const employeeRouter = require("./employee.router");
const departmentRouter = require("./department.router");

module.exports = (app) => {
  const version = "/api/v1";

  app.use(version + "/employee", employeeRouter);
  app.use(version + "/user", userRouter);
  app.use(version + "/department", departmentRouter);
};
