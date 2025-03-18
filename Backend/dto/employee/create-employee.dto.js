const { body, validationResult } = require("express-validator");
const User = require("../../model/user.model");

const createEmployeeDto = [
  body("fullName")
    .isString()
    .withMessage("Full name must be a string")
    .notEmpty()
    .withMessage("Full name is required"),
  body("dateOfBirth")
    .isISO8601()
    .withMessage("Date of birth must be a valid date")
    .notEmpty()
    .withMessage("Date of birth is required"),
  body("gender")
    .isIn(["Male", "Female"])
    .withMessage("Gender must be one of Male, Female, or Other")
    .notEmpty()
    .withMessage("Gender is required"),
  body("address")
    .isString()
    .withMessage("Address must be a string")
    .notEmpty()
    .withMessage("Address is required"),
  body("phoneNumber")
    .isString()
    .withMessage("Phone number must be a string")
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be a valid 10-digit number")
    .notEmpty()
    .withMessage("Phone number is required"),
  body("department").isString().withMessage("Department ID must be a string"),
  body("position")
    .isString()
    .withMessage("Position must be a string")
    .notEmpty()
    .withMessage("Position is required"),
  body("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid date")
    .notEmpty()
    .withMessage("Start date is required"),
  body("avatar")
    .optional() // This makes the avatar field optional
    .isString()
    .withMessage("Avatar must be a valid URL") // Ensure it's a valid URL if provided
    .custom(
      (value) =>
        value ||
        "https://scontent.fhan18-1.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=b224c7&_nc_eui2=AeF7v1imU-PIqKwzKkx3lq_FWt9TLzuBU1Ba31MvO4FTUEHwvUpI8NmYFrkYK0LevZtQrXO3WZQGzkF_9UDraTa7&_nc_ohc=UP94uBwiCgEQ7kNvgGDMb6d&_nc_oc=AdiP2ovheoQodTQZpYahH0g3wglYcPmp-A7Py02SpP20qdru3wkEKMXGT0cuJfBSrlU&_nc_zt=24&_nc_ht=scontent.fhan18-1.fna&_nc_gid=ACTuqwOTo04pAXyskaH1tjG&oh=00_AYHghiZQlDzSKzNbAve6EnbOGqx0ap8OiTgaazkAGY3zwQ&oe=67F2797A"
    ),
  body("email")
    .isEmail()
    .withMessage("email must be a valid email")
    .notEmpty()
    .withMessage("Email is required")
    .custom(async (value) => {
      const existEmail = await User.findOne({
        email: value,
      });

      if (existEmail) {
        throw new Error("Email already exist");
      }
      return true;
    }),
];

const validateCreateEmployee = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);

    return res.json({ code: 400, errors: errors.array() });
  }

  // Tạo đối tượng chứa dữ liệu hợp lệ
  const validData = {
    fullName: req.body.fullName,
    dateOfBirth: new Date(req.body.dateOfBirth), // Chuyển thành kiểu Date nếu cần
    gender: req.body.gender,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    position: req.body.position,
    startDate: new Date(req.body.startDate), // Chuyển thành kiểu Date nếu cần
    avatar:
      req.body.avatar ||
      "https://scontent.fhan18-1.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=b224c7&_nc_eui2=AeF7v1imU-PIqKwzKkx3lq_FWt9TLzuBU1Ba31MvO4FTUEHwvUpI8NmYFrkYK0LevZtQrXO3WZQGzkF_9UDraTa7&_nc_ohc=UP94uBwiCgEQ7kNvgGDMb6d&_nc_oc=AdiP2ovheoQodTQZpYahH0g3wglYcPmp-A7Py02SpP20qdru3wkEKMXGT0cuJfBSrlU&_nc_zt=24&_nc_ht=scontent.fhan18-1.fna&_nc_gid=ACTuqwOTo04pAXyskaH1tjG&oh=00_AYHghiZQlDzSKzNbAve6EnbOGqx0ap8OiTgaazkAGY3zwQ&oe=67F2797A",
  };

  // Kiểm tra và chỉ thêm department nếu không phải là 'null'
  if (req.body.department != "null") {
    validData.department = req.body.department;
  }

  const userData = {
    email: req.body.email,
    username: validData.fullName,
  };

  // Thêm dữ liệu hợp lệ vào request để có thể sử dụng sau này
  req.employeeData = validData;
  req.userData = userData;
  req.salary = req.body.salary;
  console.log(validData);
  next();
};

module.exports = { createEmployeeDto, validateCreateEmployee };
