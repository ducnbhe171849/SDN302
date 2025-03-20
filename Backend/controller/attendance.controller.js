const Attendance = require("../model/attendance.model");
const User = require("../model/user.model");
const { createLog } = require("./log.controller");

module.exports.attendance = async (req, res) => {
  try {
    const token = req.cookies.token;

    const user = await User.findOne({
      token: token,
    });

    if (!user) {
      return res.status(400).json({ message: "Login first" });
    }

    const employeeId = user.employeeId;

    const { checkInTime, checkOutTime, overtime, leave } = req.body;

    const [inHours, inMinutes] = checkInTime.split(":").map(Number);
    const [outHours, outMinutes] = checkOutTime.split(":").map(Number);

    let totalMinutesWorked =
      outHours * 60 + outMinutes - (inHours * 60 + inMinutes);

    if (totalMinutesWorked < 0) {
      return res.status(400).json({
        message: "Thời gian không hợp lệ",
      });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Lấy thời gian 00:00:00 của hôm nay
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Lấy thời gian 23:59:59 của hôm nay

    // Kiểm tra xem nhân viên đã điểm danh hôm nay chưa
    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date: { $gte: startOfDay, $lte: endOfDay }, // Kiểm tra trong ngày hôm nay
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "Bạn đã điểm danh hôm nay" });
    }

    // Leave

    let data;
    if (leave == true) {
      // // Nếu chưa điểm danh, tạo bản ghi điểm danh mới
      data = {
        employee: employeeId,
        status: "Absent", // Nếu không có trạng thái, mặc định là "Present"
        hoursWorked: 0, // Nếu không có giờ làm việc, mặc định là 8 giờ
        overTime: 0,
        date: new Date(), // Đặt ngày hiện tại
      };
    } else {
      // // Nếu chưa điểm danh, tạo bản ghi điểm danh mới
      data = {
        employee: employeeId,
        status: "Present", // Nếu không có trạng thái, mặc định là "Present"
        hoursWorked: totalMinutesWorked, // Nếu không có giờ làm việc, mặc định là 8 giờ

        date: new Date(), // Đặt ngày hiện tại
      };
      if (totalMinutesWorked > 8 * 60) {
        data.overTime = totalMinutesWorked - 480;
      }
    }

    const attendance = new Attendance(data);

    await createLog(
      "Attendance",
      req.userId,
      `Employee with id: ${employeeId} attendance`
    );
    await attendance.save();

    res.status(200).json({
      message: "Attendance success",
      data: attendance,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 500,
      error,
    });
  }
};

/**
 * ====================================
 * [GET] /attendance/statistic
 * ====================================
 */

module.exports.attendanceStatistic = async (req, res) => {
  try {
    let { month, year } = req.query;

    const currentDate = new Date();
    const selectedMonth = month ? parseInt(month) : currentDate.getMonth() + 1; // getMonth() trả về từ 0-11, nên cần +1
    const selectedYear = year ? parseInt(year) : currentDate.getFullYear();

    if (!month) {
      month = selectedMonth;
    }

    if (!year) {
      year = selectedYear;
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceStats = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$employee",
          totalPresent: {
            $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] },
          },
          totalAbsent: {
            $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] },
          },
          totalHoursWorked: { $sum: "$hoursWorked" },
          totalOverTime: { $sum: { $ifNull: ["$overTime", 0] } },
        },
      },
      {
        $addFields: {
          employeeId: { $toObjectId: "$_id" }, // ✅ Convert ID về ObjectId nếu cần
        },
      },
      {
        $lookup: {
          from: "employees", // ✅ Tìm trong bảng employees
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $unwind: {
          path: "$employee",
          preserveNullAndEmptyArrays: true, // ✅ Tránh lỗi nếu không có employee nào match
        },
      },
      {
        $lookup: {
          from: "departments", // ✅ Tìm trong bảng departments
          localField: "employee.department",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true, // ✅ Tránh lỗi nếu employee không có department
        },
      },
      {
        $lookup: {
          from: "salaries", // ✅ Tìm trong bảng salaries
          localField: "employee.salary",
          foreignField: "_id",
          as: "salary",
        },
      },
      {
        $unwind: {
          path: "$salary",
          preserveNullAndEmptyArrays: true, // ✅ Tránh lỗi nếu không có salary nào match
        },
      },
      {
        $project: {
          _id: 0,
          employeeId: "$employee._id",
          fullName: "$employee.fullName",
          dateOfBirth: "$employee.dateOfBirth",
          gender: "$employee.gender",
          address: "$employee.address",
          phoneNumber: "$employee.phoneNumber",
          department: "$department.departmentName", // ✅ Hiển thị tên department thay vì ID
          position: "$employee.position",
          salary: "$salary.amount", // ✅ Hiển thị mức lương thay vì ID
          startDate: "$employee.startDate",
          avatar: "$employee.avatar",
          totalPresent: 1,
          totalAbsent: 1,
          totalHoursWorked: 1,
          totalOverTime: 1,
        },
      },
    ]);

    res.status(200).json({
      data: attendanceStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
