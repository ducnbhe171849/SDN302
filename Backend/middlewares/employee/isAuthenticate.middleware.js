const User = require("../../model/user.model");

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "You must login to continue", code: 401 });
  }

  const theUser = await User.findOne({
    token: token,
  });

  if (!theUser) {
    return res
      .status(401)
      .json({ message: "You must login to continue", code: 401 });
  }
  res.role = theUser.role;
  req.role = theUser.role;
  req.userId = theUser.id;

  next(); // Nếu đã đăng nhập, tiếp tục xử lý yêu cầu
};

module.exports = isAuthenticated;
