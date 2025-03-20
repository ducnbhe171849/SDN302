const User = require("../../model/user.model");

const isAdminRole = async (req, res, next) => {
  if (res.role != "Admin") {
    return res.status(401).json({ message: "forbidden resource", code: 403 });
  }
  next(); // Nếu đã đăng nhập, tiếp tục xử lý yêu cầu
};

module.exports = isAdminRole;
