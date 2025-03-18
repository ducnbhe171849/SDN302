const express = require("express");

const controller = require("../../../controller/department.controller");

const isAuthenticated = require("../../../middlewares/employee/isAuthenticate.middleware");
const isAdminRole = require("../../../middlewares/employee/isAdminRole.middleware");
const {
  departmentDto,
  validateDepartment,
} = require("../../../dto/department/create-department.dto");
const {
  departmentUpdateDTO,
  validateDepartmentUpdate,
} = require("../../../dto/department/update-department.dto");

const router = new express.Router();

/**
 * ====================================
 * [POST] /department/create
 * ====================================
 */
router.post(
  "/create",
  isAuthenticated,
  isAdminRole,
  departmentDto,
  validateDepartment,
  controller.createDepartment
);

/**
 * ====================================
 * [PATCH] /department/:id
 * ====================================
 */
router.patch(
  "/:id",
  isAuthenticated,
  isAdminRole,
  departmentUpdateDTO,
  validateDepartmentUpdate,
  controller.updateDepartment
);

/**
 * ====================================
 * [GET] /department/:id
 * ====================================
 */
router.get("/:id", isAuthenticated, isAdminRole, controller.getDepartmentById);

/**
 * ====================================
 * [GET] /department
 * ====================================
 */
router.get("/", isAuthenticated, isAdminRole, controller.getAllDepartment);

/**
 * ====================================
 * [DELETE] /department/:id
 * ====================================
 */
router.delete(
  "/:id",
  isAuthenticated,
  isAdminRole,
  controller.deleteDepartment
);

/**
 * ====================================
 * [PATCH] /department/employee/delete/:id
 * ====================================
 */
router.patch(
  "/employee/delete/:id",
  isAuthenticated,
  isAdminRole,
  controller.deleteEmployee
);

/**
 * ====================================
 * [PATCH] /department/employee/add
 * ====================================
 */
router.patch(
  "/:id/employee/add",
  isAuthenticated,
  isAdminRole,
  controller.addEmployeeToDepartment
);

/**
 * ====================================
 * [GET] /department/statistic/:id
 * ====================================
 */
router.get(
  "/statistic/:id",
  isAuthenticated,
  isAdminRole,
  controller.departmentStatistic
);

/**
 * ====================================
 * [GET] /department/statistic
 * ====================================
 */
router.get(
  "/statistics/all",
  isAuthenticated,
  isAdminRole,
  controller.departmentStatisticAll
);

module.exports = router;
