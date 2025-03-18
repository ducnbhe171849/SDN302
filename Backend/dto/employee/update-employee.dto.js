const { body, validationResult } = require("express-validator");

// Middleware validate dữ liệu cập nhật Employee
const employeeUpdateDto = [
  body("fullName")
    .optional()
    .isString()
    .withMessage("Full name must be a string"),
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Date of birth must be a valid date"),
  body("gender")
    .optional()
    .isIn(["Male", "Female"])
    .withMessage("Gender must be one of Male, Female, or Other"),
  body("address").optional().isString().withMessage("Address must be a string"),
  body("phoneNumber")
    .optional()
    .isString()
    .withMessage("Phone number must be a string")
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be a valid 10-digit number"),
  body("department")
    .optional()
    .isString()
    .withMessage("Department ID must be a string"),
  body("position")
    .optional()
    .isString()
    .withMessage("Position must be a string"),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  body("avatar").optional().isURL().withMessage("Avatar must be a valid URL"),
];

// Middleware để xử lý lỗi validation
const validateUpdateDto = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

module.exports = { employeeUpdateDto, validateUpdateDto };
