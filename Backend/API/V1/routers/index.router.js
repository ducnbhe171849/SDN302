"use strict";

const employeeRouter = require("./employee.router");

module.exports = (app) => {
  const version = "/api/v1";

  app.use(version + "/employee", employeeRouter);

};
