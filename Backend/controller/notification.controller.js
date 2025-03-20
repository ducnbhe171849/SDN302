const { default: mongoose } = require("mongoose");
const Department = require("../model/department.model");
const Notification = require("../model/notification.model");
const User = require("../model/user.model");
const Employee = require("../model/employee.model");
const { createLog } = require("./log.controller");

/**
 * ====================================
 * [POST] /notification
 * ====================================
 */
module.exports.createNotification = async (req, res) => {
  const { title, content, department } = req.body;

  // Kiểm tra xem phòng ban có tồn tại không  const existDepartment = await Department.findById(targetDepartment);

  let departmentId = null;
  if (department != "all") {
    const existDepartment = await Department.findById(department);
    if (!existDepartment) {
      return res.status(404).json({ message: "Phòng ban không tồn tại" });
    }

    departmentId = existDepartment.id;
  }

  // Tạo thông báo mới
  const notification = new Notification({
    title,
    message: content,
    targetDepartment: departmentId,
    sentBy: req.userId, // Lấy ID người gửi từ thông tin người dùng đã xác thực
  });

  try {
    await notification.save(); // Lưu thông báo vào database
    await createLog("Create", req.userId, `Create a notification`);
    res.status(201).json({ message: "Thông báo đã được gửi", notification });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi gửi thông báo", error: error.message });
  }
};

/**
 * ====================================
 * [GET] /notification
 * ====================================
 */
module.exports.getNotification = async (req, res) => {
  //   console.log(req.role);
  try {
    if (req.role == "Admin") {
      const notifications = await Notification.find()
        .populate("sentBy")
        .populate("targetDepartment")
        .sort({ createdAt: -1 });
      return res.status(200).json({
        data: notifications,
      });
    }

    const existEmployee = await User.findById(req.userId).populate(
      "employeeId"
    );
    console.log(existEmployee);

    const notifications = await Notification.find({
      $or: [
        {
          targetDepartment: null,
        },
        { targetDepartment: existEmployee?.employeeId?.department },
      ],
    })
      .populate("targetDepartment")
      .populate("sentBy")
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: notifications,
    });
  } catch (error) {
    console.log(error);
    return res.code(500).json({
      message: error,
    });
  }
};
