const { body, check, validationResult } = require("express-validator");
const Employee = require("../../model/employee.model");
const User = require("../../model/user.model");
const { default: mongoose } = require("mongoose");

// Validator cho Department
const departmentDto = [
  // Kiểm tra departmentName: không được để trống và có độ dài tối thiểu là 3 ký tự
  body("departmentName")
    .notEmpty()
    .withMessage("Department name is required")
    .isLength({ min: 1 })
    .withMessage("Department name must be at least 1 characters long"),

  // Kiểm tra manager: phải là một ObjectId hợp lệ, liên kết với Employee
  body("manager")
    .notEmpty()
    .withMessage("Manager is required")
    .isString()
    .withMessage("Manager must be a valid string")
    .custom(async (value) => {
      const employee = await Employee.findById(value);

      if (!employee) {
        throw new Error("Manager must be an existing Employee");
      }
      return true;
    }),

  // Kiểm tra employees: nếu có giá trị thì phải là một mảng các ObjectId hợp lệ
  body("employees")
    .optional()
    .isArray()
    .withMessage("Employees must be an array of ObjectIds")
    .custom(async (value) => {
      for (const employeeId of value) {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
          throw new Error("Each employee must be an existing Employee");
        }
      }
      return true;
    }),
];

// Middleware để kiểm tra validation kết quả
const validateDepartment = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { departmentDto, validateDepartment };
