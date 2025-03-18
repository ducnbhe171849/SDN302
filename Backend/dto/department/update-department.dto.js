const { body, validationResult } = require("express-validator");
const User = require("../../model/user.model");
const Employee = require("../../model/employee.model");

// Department Update DTO
const departmentUpdateDTO = [
  // Kiểm tra departmentName: phải là chuỗi và tối thiểu 3 ký tự
  body("departmentName")
    .optional() // Không bắt buộc, vì có thể không thay đổi
    .isString()
    .withMessage("Department name must be a string")
    .isLength({ min: 3 })
    .withMessage("Department name must be at least 3 characters long"),

  // Kiểm tra manager: phải là ObjectId hợp lệ và là Employee tồn tại
  body("manager")
    .optional() // Không bắt buộc, vì có thể không thay đổi
    .isMongoId()
    .withMessage("Manager must be a valid ObjectId")
    .custom(async (value) => {
      const employee = await User.findById(value);
      if (!employee) {
        throw new Error("Manager must be an existing Employee");
      }
      return true;
    }),

  // Kiểm tra employees: phải là một mảng các ObjectId hợp lệ
  body("employees")
    .optional() // Không bắt buộc, vì có thể không thay đổi
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

// Middleware để kiểm tra kết quả validation
const validateDepartmentUpdate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { departmentUpdateDTO, validateDepartmentUpdate };
