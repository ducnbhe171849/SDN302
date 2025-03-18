const { default: mongoose } = require("mongoose");
const Department = require("../model/department.model");
const User = require("../model/user.model");
const Employee = require("../model/employee.model");
const { createLog } = require("./log.controller");

/**
 * ====================================
 * [POST] /api/v1/department/crete
 * create department
 * ====================================
 */
module.exports.createDepartment = async (req, res) => {
  try {
    const { departmentName, manager, employees } = req.body;

    const alreadyInList = employees.find((item) => {
      return item == manager;
    });

    if (!alreadyInList) {
      employees.push(manager);
    }

    // Tạo một Department mới
    const newDepartment = new Department({
      departmentName,
      manager: manager,
      employees: employees,
    });

    await newDepartment.save();
    // // Lưu vào cơ sở dữ liệu

    for (const e of employees) {
      const findEmp = await Employee.findById(e);
      findEmp.department = newDepartment.id;

      if (e == manager + "") {
        findEmp.position = "Manager";
      }

      await findEmp.save();
    }

    await createLog("Create", req.userId, `Create a department`);

    // Trả về kết quả
    res.status(201).json({
      code: 201,
      message: "Department created successfully!",
      data: newDepartment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

/**
 * ====================================
 * [PATCH] /api/v1/department
 * ====================================
 */
module.exports.updateDepartment = async (req, res) => {
  try {
    const { departmentName, manager, employees } = req.body;
    const { id } = req.params; // Lấy ID của department cần sửa từ URL

    // Tìm department theo ID
    const department = await Department.findById(id);

    // Kiểm tra nếu department không tồn tại
    if (!department) {
      return res
        .status(404)
        .json({ code: 404, message: "Department not found" });
    }

    // Cập nhật các trường trong department
    department.departmentName = departmentName || department.departmentName;
    department.manager = manager || department.manager;
    department.employees = employees || department.employees;

    // Lưu lại sự thay đổi
    await department.save();
    await createLog("Update", req.userId, `Update a departments`);

    // Trả về kết quả
    res.status(200).json({
      code: 200,
      message: "Department updated successfully!",
      department,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, error: "Internal server error" });
  }
};

/**
 * ====================================
 * [GET] /department/:id
 * get department by ids
 * ====================================
 */
module.exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID của Department từ URL

    // Tìm Department theo ID
    const department = await Department.findById(id)
      .populate("manager")
      .populate("employees");

    // Kiểm tra nếu Department không tồn tại
    if (!department) {
      return res
        .status(404)
        .json({ code: 404, message: "Department not found" });
    }

    // Trả về Department
    res.status(200).json({
      code: 200,
      data: department,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, error });
  }
};

/**
 * ====================================
 * [GET] /department
 * get all department
 * ====================================
 */
module.exports.getAllDepartment = async (req, res) => {
  try {
    const departments = await Department.find(
      {},
      {
        _id: 1,
        departmentName: 1,
      }
    );

    if (!departments) {
      res.status(404).json({ code: 404, message: "No available department" });
    }

    res.status(200).json({ code: 200, data: departments });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch departments");
  }
};

/**
 * ====================================
 * [DELETE] /department/:id
 * ====================================
 */
module.exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL

    // Tìm và xóa Department theo ID
    const department = await Department.findByIdAndDelete(id);

    for (const item of department.employees) {
      try {
        const employee = await Employee.findById(item);
        if (employee) {
          employee.department = null;
          await employee.save(); // Đảm bảo rằng save được await
        }
      } catch (error) {
        console.error(`Error updating employee ${item}:`, error);
      }
    }

    // Kiểm tra xem Department có tồn tại không
    if (!department) {
      return res
        .status(404)
        .json({ code: 404, message: "Department not found" });
    }

    // Trả về kết quả xóa thành công
    await createLog(
      "Delete",
      req.userId,
      `Delete department ${department.departmentName}`
    );

    res
      .status(200)
      .json({ code: 200, message: "Department deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, error });
  }
};

/**
 * ====================================
 * /department/employee/delete/:id
 * ====================================
 */
module.exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    // Kiểm tra xem phòng ban có tồn tại không
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: "Phòng ban không tồn tại" });
    }

    // Kiểm tra xem nhân viên có trong phòng ban không
    if (!department.employees.includes(employeeId)) {
      return res
        .status(400)
        .json({ message: "Nhân viên không thuộc phòng ban này" });
    }

    // Xóa nhân viên khỏi danh sách phòng ban
    department.employees = department.employees.filter(
      (id) => id.toString() !== employeeId
    );
    await department.save();

    // Cập nhật `department` của nhân viên thành `null`
    await Employee.findByIdAndUpdate(
      employeeId,
      { department: null },
      {
        new: true,
      }
    );

    await createLog(
      "Delete",
      req.userId,
      `Delete an employee out of department: ${department.departmentName}`
    );

    return res.json({
      message: "Xóa nhân viên khỏi phòng ban thành công!",
      data: department,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

/**
 * ====================================
 * /department/employee/add
 * ====================================
 */
module.exports.addEmployeeToDepartment = async (req, res) => {
  try {
    const { id: departmentId } = req.params; // Lấy ID phòng ban từ URL
    const { employeeId } = req.body; // Lấy ID nhân viên từ body request

    // Kiểm tra xem phòng ban có tồn tại không
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Phòng ban không tồn tại" });
    }

    // Kiểm tra xem nhân viên có tồn tại không
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Nhân viên không tồn tại" });
    }

    // Kiểm tra xem nhân viên đã thuộc phòng ban này chưa
    if (department.employees.includes(employeeId)) {
      return res
        .status(400)
        .json({ message: "Nhân viên đã ở trong phòng ban" });
    }

    // Cập nhật danh sách nhân viên của phòng ban
    department.employees.push(employeeId);
    await department.save();

    // Cập nhật `department` của nhân viên
    employee.department = departmentId;
    await employee.save();

    await createLog(
      "Update",
      req.userId,
      `Add an employee to department: ${department.departmentName}`
    );

    return res.json({
      message: "Thêm nhân viên vào phòng ban thành công",
      updatedDepartment: department,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

module.exports.departmentStatistic = async (req, res) => {
  try {
    const departmentID = new mongoose.Types.ObjectId(req.params.id);

    // Kiểm tra xem departmentID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(departmentID)) {
      return res.status(400).json({ message: "Invalid department ID" });
    }

    // Tìm phòng ban theo ID
    const department = await Department.findById(departmentID).populate(
      "employees"
    );
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Thống kê số lượng nhân viên theo chức vụ
    const positionStats = await Employee.aggregate([
      {
        $match: { department: departmentID }, // Lọc theo departmentID
      },
      {
        $group: {
          _id: "$position",
          count: { $sum: 1 },
        },
      },
    ]);

    // Thống kê số lượng nhân viên theo giới tính
    const genderStats = await Employee.aggregate([
      {
        $match: { department: departmentID }, // Lọc theo departmentID
      },
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
    ]);

    // Kết quả trả về
    const result = {
      departmentName: department.departmentName,
      totalEmployees: department.employees.length,
      positionStats: positionStats.map((stat) => ({
        position: stat._id,
        employeeCount: stat.count,
      })),
      genderStats: genderStats.map((stat) => ({
        gender: stat._id,
        employeeCount: stat.count,
      })),
    };

    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching employee statistics", error });
  }
};

module.exports.departmentStatisticAll = async (req, res) => {
  try {
    // Lấy tất cả các phòng ban
    const departments = await Department.find().populate("employees");

    if (!departments || departments.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có phòng ban nào cho việc thống kê" });
    }

    // Khởi tạo mảng để chứa kết quả thống kê cho từng phòng ban
    const departmentStats = [];

    // Duyệt qua từng phòng ban để làm thống kê
    for (const department of departments) {
      // Thống kê số lượng nhân viên theo chức vụ
      const positionStats = await Employee.aggregate([
        {
          $match: { department: department._id }, // Lọc theo department
        },
        {
          $group: {
            _id: "$position",
            count: { $sum: 1 },
          },
        },
      ]);

      // Thống kê số lượng nhân viên theo giới tính
      const genderStats = await Employee.aggregate([
        {
          $match: { department: department._id }, // Lọc theo department
        },
        {
          $group: {
            _id: "$gender",
            count: { $sum: 1 },
          },
        },
      ]);

      // Kết quả thống kê cho phòng ban hiện tại
      const departmentResult = {
        departmentName: department.departmentName,
        totalEmployees: department.employees.length,
        positionStats: positionStats.map((stat) => ({
          position: stat._id,
          employeeCount: stat.count,
        })),
        genderStats: genderStats.map((stat) => ({
          gender: stat._id,
          employeeCount: stat.count,
        })),
      };

      // Thêm kết quả thống kê của phòng ban vào mảng
      departmentStats.push(departmentResult);
    }

    const totalEmployees = await Employee.countDocuments();

    // Trả về kết quả thống kê cho tất cả các phòng ban
    res.json({
      data: departmentStats,
      totalEmployees,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching employee statistics", error });
  }
};
