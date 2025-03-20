const express = require("express");

const controller = require("../../../controller/attendance.controller");
const isAuthenticated = require("../../../middlewares/employee/isAuthenticate.middleware");
const isAdminRole = require("../../../middlewares/employee/isAdminRole.middleware");

const router = new express.Router();

/**
 * ====================================
 * [POST] /attendance
 * ====================================
 */
router.post("/", isAuthenticated, controller.attendance);

/**
 * ====================================
 * [GET] /attendance/statistic
 * ====================================
 */
router.get(
  "/statistic",
  isAuthenticated,
  isAdminRole,
  controller.attendanceStatistic
);

module.exports = router;
