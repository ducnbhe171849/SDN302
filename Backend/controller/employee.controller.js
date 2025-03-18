const mongoose = require("mongoose");
const Employee = require("../model/employee.model");
const Leave = require("../model/leave.model");
const Salary = require("../model/salary.model");
const User = require("../model/user.model");
const md5 = require("md5");
const Department = require("../model/department.model");
const { send } = require("../helper/sendmail.helper");
const { createLog } = require("./log.controller");
const Attendance = require("../model/attendance.model");
const { random } = require("../helper/randomToken");
const Payment = require("../model/payment.model");
const ActivityLog = require("../model/log.model");

/**
 * ====================================
 * [GET] /api/v1/employee
 * ====================================
 */
module.exports.getAll = async (req, res) => {
  const {
    search,
    gender,
    maxSalary,
    startDate,
    notBelongDepartment,
    department, // Thêm tham số department vào query
  } = req.query;

  // Xây dựng đối tượng tìm kiếm và lọc động
  const searchFilterQuery = {};

  // Nếu có search, kết hợp tìm kiếm fullName, department, và position
  if (search) {
    searchFilterQuery.$or = [
      { fullName: { $regex: search.toLowerCase(), $options: "i" } },
      { position: { $regex: search.toLowerCase(), $options: "i" } },
    ];
  }

  // Lọc theo giới tính
  if (gender && gender != "all") {
    searchFilterQuery.gender = gender;
  }

  // Lọc theo ngày bắt đầu làm việc (startDate)
  if (startDate) {
    searchFilterQuery.startDate = { $gte: new Date(startDate) };
  }

  // Lọc theo department nếu có
  if (department && department != "all") {
    searchFilterQuery.department = department;
  }

  // Nếu không muốn nhân viên thuộc phòng ban nào, tìm những người không có department
  if (notBelongDepartment == "true") {
    searchFilterQuery.department = null;
  }

  try {
    // Nếu không có bất kỳ tiêu chí tìm kiếm hoặc lọc nào, lấy tất cả nhân viên
    let employees = await Employee.find(searchFilterQuery)
      .populate("department")
      .populate("salary");

    // Nếu không tìm thấy nhân viên

    if (maxSalary && parseInt(maxSalary) > 0) {
      employees = employees.filter((item) => {
        return item?.salary?.baseSalary >= parseInt(maxSalary);
      });
    }

    if (employees.length === 0) {
      return res.json({
        code: 404,
        message: "No employees found matching the criteria",
      });
    }

    // Trả về danh sách nhân viên tìm được
    res.status(200).json({ code: 200, data: employees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Server error" });
  }
};

/**
 * ====================================
 * [POST] /api/v1/employee/create
 * ====================================
 */
module.exports.create = async (req, res) => {
  try {
    // Validate incoming data
    const { employeeData, userData, salary } = req; // Ensure it's from req.body

    if (!employeeData || !userData || !salary) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Step 1: Create the salary record
    const newSalary = new Salary({
      baseSalary: parseInt(salary),
    });

    // Save salary to DB
    await newSalary.save();

    // Step 2: Create the employee record
    const newEmployee = new Employee({
      ...employeeData,
      salary: newSalary.id, // Associate employee with salary
    });

    // Save employee to DB
    await newEmployee.save();

    // Step 3: If department is not null, add employee to department's employees array
    if (employeeData.department) {
      const department = await Department.findById(employeeData.department);

      if (department) {
        department.employees.push(newEmployee._id); // Add employee to department
        await department.save();
      }
    }

    // Step 4: Create the user record
    const user = new User({
      ...userData,
      token: random(50),
      password: md5("12345"), // Default password
      employeeId: newEmployee.id, // Link the employee to the user
      status: "Waiting",
    });

    // Save user to DB
    await user.save();

    send(
      user.email,
      "Cấp tài khoản",
      "Bạn đã được thêm cấp tài khoản mật khẩu mặc định là: 12345"
    );

    await createLog("Create", req.userId, `Create an employee`);

    return res.json({
      code: 200,
      message: "Employee created successfully",
      data: newEmployee,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred during the employee creation process",
      error: error.message || error,
    });
  }
};

/**
 * ====================================
 * get an employee
 * [GET] /api/v1/employee/:id
 * ====================================
 */
module.exports.getEmployeeById = async (req, res) => {
  const employeeId = req.params.id; // Lấy id từ params trong URL

  try {
    const employee = await Employee.findById(employeeId)
      .populate("salary")
      .populate("department");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ data: employee, code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * ====================================
 * [PUT] /api/v1/employee/:id
 * ====================================
 */
module.exports.updateEmployee = async (req, res) => {
  const employeeId = req.params.id; // Lấy id từ params trong URL
  const updateData = req.body; // Lấy dữ liệu cập nhật từ body

  try {
    // xoa nhan vien nay ra khoi phong ban cu
    const employeeInfo = await Employee.findById(employeeId);

    if (employeeInfo.department != null) {
      const temp = await Department.findByIdAndUpdate(
        employeeInfo.department,
        {
          $pull: {
            employees: employeeId,
          },
        },
        {
          new: true,
        }
      );
      console.log(temp);
    }

    console.log(updateData.department);

    await Department.findByIdAndUpdate(updateData.department, {
      $push: {
        employees: employeeId,
      },
    });

    // Tìm employee và cập nhật thông tin
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updateData,
      {
        new: true, // Trả về tài liệu đã được cập nhật
        runValidators: true, // Kiểm tra lại các validators (ví dụ: kiểu dữ liệu, yêu cầu bắt buộc)
      }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ code: 404, message: "Employee not found" });
    }

    await createLog("Update", req.userId, `Updated an employee`);

    // Trả về thông tin employee đã được cập nhật
    res.status(200).json({
      code: 200,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Server error", error });
  }
};

/**
 * ====================================
 * [DELETE] /api/v1/employee/:id
 * delete an employee
 * ====================================
 */
module.exports.deleteEmployee = async (req, res) => {
  const employeeId = req.params.id; // Lấy id từ params trong URL

  try {
    // Tìm và xoá employee theo id
    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

    // xoa khoi phong ban
    await Department.updateOne(
      {
        employees: employeeId,
      },
      {
        $pull: { employees: employeeId },
      }
    );

    // xoa tai khoan
    const user = await User.findOneAndDelete({
      employeeId: employeeId,
    });

    // xoa diem danh
    await Attendance.deleteMany({
      employee: employeeId,
    });

    await ActivityLog.deleteMany({
      performedBy: user.id,
    });

    if (!deletedEmployee) {
      return res.status(404).json({ code: 200, message: "Employee not found" });
    }

    createLog(
      "Delete",
      req.userId,
      "Delete employee : " + deletedEmployee.fullName
    );

    // Trả về thông báo khi xoá thành công
    res
      .status(200)
      .json({ code: 200, message: "Employee deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Server error", error });
  }
};

/**
 * ====================================
 * [PATCH] /employee/:id/salary/update
 * ====================================
 */
module.exports.updateSalary = async (req, res) => {
  const { baseSalary, bonuses, deductions } = req.body;
  const { id } = req.params;

  try {
    // Tìm nhân viên theo ID
    const employee = await Employee.findById(id);

    if (!employee || !employee.salary) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy nhân viên hoặc salaryId" });
    }

    // Tìm thông tin lương từ salaryId
    const salary = await Salary.findById(employee.salary);

    if (!salary) {
      return res.status(404).json({ error: "Không tìm thấy thông tin lương" });
    }

    // Cập nhật thông tin lương
    if (baseSalary !== undefined) salary.baseSalary = baseSalary;
    if (bonuses !== undefined) salary.bonuses = bonuses;
    if (deductions !== undefined) salary.deductions = deductions;

    // Tính lại tổng lương
    salary.totalSalary = salary.baseSalary + salary.bonuses - salary.deductions;

    // Lưu vào database
    await salary.save();
    await createLog("Update", req.userId, `Update salary employee`);

    res.json({ message: "Lương đã được cập nhật", data: salary });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi khi cập nhật lương", details: error.message });
  }
};

/**
 * ====================================
 *[GET] /employee/salary/rewardAndPunishment
 * ====================================
 */
module.exports.getAwardPunishment = async (req, res) => {
  const { id } = req.params;

  try {
    const listAttendance = await Attendance.find({
      pay: false,
      employee: id,
    });

    let totalHoursWork = 0;

    // get all time work
    listAttendance.forEach((item) => {
      totalHoursWork += item.hoursWorked;
    });

    // get hour work more or less
    let subHours = totalHoursWork / 60 - 160;

    const user = await Employee.findById(id).populate("salary");

    // get salary base
    const salary = user.salary;

    // sub salary
    let subSalary =
      subHours > 0
        ? subHours * 1.5 * (salary.baseSalary / 160)
        : subHours * (salary.baseSalary / 160);

    // calculate ratio
    let totalSalary =
      salary.baseSalary + subSalary + salary.bonuses - salary.deductions;

    return res.json({
      totalSalary: totalSalary,
      bonus: subSalary > 0 ? subSalary : 0,
      punish: subSalary < 0 ? subSalary * -1 : 0,
      totalHoursWork: totalHoursWork,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Lỗi khi cập nhật lương", details: error.message });
  }
};

/**
 * ====================================
 * [POST] /employee/:id/salary/payment
 * ====================================
 */
module.exports.paymentSalary = async (req, res) => {
  const { id } = req.params;

  try {
    const listAttendance = await Attendance.find({
      pay: false,
      employee: id,
    });
    let totalHoursWork = 0;
    // get all time work
    listAttendance.forEach((item) => {
      totalHoursWork += item.hoursWorked;
    });
    // get hour work more or less
    let subHours = totalHoursWork / 60 - 160;
    const user = await Employee.findById(id).populate("salary");
    // get salary base
    const salary = user.salary;
    // sub salary
    let subSalary =
      subHours > 0
        ? subHours * 1.5 * (salary.baseSalary / 160)
        : subHours * (salary.baseSalary / 160);
    // calculate ratio
    let totalSalary =
      salary.baseSalary + subSalary + salary.bonuses - salary.deductions;

    if (totalSalary <= 0) {
      return res.status(200).json({
        code: 400,
        message: "Không thể trả lương",
      });
    }
    // update paid
    for (const item of listAttendance) {
      item.pay = true;
      await item.save();
    }

    const payment = new Payment({
      performBy: req.userId,
      targetEmployee: id,
      total: totalSalary,
      deductions: salary.deductions,
      bonus: salary.bonuses,
      totalHoursWork: totalHoursWork,
    });

    await payment.save();
    const account = await User.findOne(
      {
        employeeId: id,
      },
      {
        email: 1,
      }
    );
    send(
      account.email,
      `Thanh Toán Lương (${payment.id})`,
      `Lương tháng này Tổng: ${totalSalary} Phạt: ${salary.deductions} Thưởng: ${salary.bonuses} Tổng thời gian làm việc: ${totalHoursWork}`
    );
    createLog(
      "Payment salary",
      req.userId,
      `Thanh toán lương cho nhân viên ${user.fullName}`
    );

    res.status(200).json({
      code: 200,
      message: "Success",
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

/**
 * ====================================
 * [GET] employee/:id/salary/history
 * ====================================
 */
module.exports.salaryHistory = async (req, res) => {
  try {
    const id = req.params.id;

    const history = await Payment.find(
      {
        targetEmployee: id,
      },
      {
        total: 1,
        deductions: 1,
        createdAt: 1,
        bonus: 1,
      }
    );

    return res.json({
      message: 200,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

/**
 * ====================================
 *
 * ====================================
 */
const getTotalSalaryByMonth = async (year) => {
  const result = await Payment.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(year, 0, 1), // Đầu năm
          $lt: new Date(year + 1, 0, 1), // Cuối năm
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" }, // Nhóm theo tháng
        totalSalary: { $sum: "$total" }, // Tổng lương
      },
    },
    {
      $project: {
        _id: 0, // Loại bỏ trường _id
        month: "$_id", // Hiển thị tháng
        totalSalary: 1, // Hiển thị tổng lương
      },
    },
  ]);
  return result;
};

// Thống kê tổng lương theo quý
const getTotalSalaryByQuarter = async (year) => {
  const monthsInQuarter = {
    1: [1, 2, 3], // Quý 1 (Tháng 1, 2, 3)
    2: [4, 5, 6], // Quý 2 (Tháng 4, 5, 6)
    3: [7, 8, 9], // Quý 3 (Tháng 7, 8, 9)
    4: [10, 11, 12], // Quý 4 (Tháng 10, 11, 12)
  };

  let result = [];

  // Duyệt qua các quý
  for (let quarter = 1; quarter <= 4; quarter++) {
    const months = monthsInQuarter[quarter];
    const data = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(year, months[0] - 1, 1), // Đầu quý
            $lt: new Date(year, months[months.length - 1], 1), // Cuối quý
          },
        },
      },
      {
        $group: {
          _id: { $literal: quarter }, // Nhóm theo quý (quý 1, 2, 3, 4)
          totalSalary: { $sum: "$total" }, // Tổng lương
        },
      },
      {
        $project: {
          _id: 0, // Loại bỏ trường _id
          quarter: "$_id", // Hiển thị quý
          totalSalary: 1, // Hiển thị tổng lương
        },
      },
    ]);

    result.push(...data);
  }

  return result;
};

/**
 * ====================================
 * [GET] /employee/salary/statistic/:year
 * ====================================
 */
module.exports.salaryStatistic = async (req, res) => {
  const { year } = req.params;

  try {
    // Lấy tổng lương cho tất cả các tháng trong năm
    const monthlyStats = await getTotalSalaryByMonth(parseInt(year));

    // Lấy tổng lương cho tất cả các quý trong năm
    const quarterlyStats = await getTotalSalaryByQuarter(parseInt(year));

    // Trả về cả tổng lương theo tháng và theo quý
    res.json({
      monthlyStats,
      quarterlyStats,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

/**
 * ====================================
 * [GET] /employee/emails
 * ====================================
 */
module.exports.getAllEmailsPhones = async (req, res) => {
  try {
    const rawEmails = await User.find({}, { email: 1 });
    const rawPhones = await Employee.find({}, { phoneNumber: 1 });

    const listEmails = rawEmails.map((item) => {
      return item.email;
    });

    const listPhones = rawPhones.map((item) => {
      return item.phoneNumber;
    });

    res.status(200).json({
      emails: listEmails,
      phones: listPhones,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
