const express = require("express");
const Employee = require("../../../model/employee.model");
const controller = require("../../../controller/employee.controller");
const { body } = require("express-validator");
const isAuthenticated = require("../../../middlewares/employee/isAuthenticate.middleware");
const isAdminRole = require("../../../middlewares/employee/isAdminRole.middleware");
const {
  createEmployeeDto,
  validateCreateEmployee,
} = require("../../../dto/employee/create-employee.dto");
const {
  employeeUpdateDto,
  validateUpdateDto,
} = require("../../../dto/employee/update-employee.dto");

const router = new express.Router();

/**
 * ====================================
 * [GET] /api/v1/employee
 * get all employees
 * ====================================
 */
router.get("/", controller.getAll);

/**
 * ====================================
 * [GET] /api/v1/employee/:id
 * ====================================
 */
router.get("/:id", isAuthenticated, isAdminRole, controller.getEmployeeById);

/**
 * ====================================
 * [POST] /api/v1/employee
 * create an employee
 * ====================================
 */
router.post(
  "/create",
  isAuthenticated,
  isAdminRole,
  createEmployeeDto,
  validateCreateEmployee,
  controller.create
);

/**
 * ====================================
 * [PATCH}] /api/v1/employee/:id
 *  update employee
 * ====================================
 */
router.patch(
  "/:id",
  isAuthenticated,
  isAdminRole,
  employeeUpdateDto,
  validateUpdateDto,
  controller.updateEmployee
);

/**
 * ====================================
 * [DELETE]  /api/v1/employee/:id
 * ====================================
 */
router.delete("/:id", isAuthenticated, isAdminRole, controller.deleteEmployee);

/**
 * ====================================
 * [PATCH] /employee/:id/salary/update
 * ====================================
 */
router.patch(
  "/:id/salary/update",
  isAuthenticated,
  isAdminRole,
  controller.updateSalary
);

/**
 * ====================================
 * [GET] /employee/:id/subSalary
 * ====================================
 */
router.get(
  "/:id/subSalary",
  isAuthenticated,
  isAdminRole,
  controller.getAwardPunishment
);

/**
 * ====================================
 * [POST] /employee/:id/salary/payment
 * ====================================
 */
router.post(
  "/:id/salary/payment",
  isAuthenticated,
  isAdminRole,
  controller.paymentSalary
);

/**
 * ====================================
 * [GET] employee/:id/salary/history
 * ====================================
 */
router.get(
  "/:id/salary/history",
  isAuthenticated,
  isAdminRole,
  controller.salaryHistory
);

/**
 * ====================================
 * [GET] /employee/salary/statistic/:year
 * ====================================
 */
router.get(
  "/salary/statistic/:year",
  isAuthenticated,
  isAdminRole,
  controller.salaryStatistic
);

/**
 * ====================================
 * [GET] /employee/information/emails+phones
 * ====================================
 */
router.get(
  "/information/emailsPhones",
  isAuthenticated,
  isAdminRole,
  controller.getAllEmailsPhones
);

module.exports = router;
