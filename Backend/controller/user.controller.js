const forgotModel = require("../model/forgotPassword.model");

const sendMail = require("../helper/sendmail.helper");
const md5 = require("md5");
const random = require("../helper/randomToken");
const User = require("../model/user.model");
const { validationResult } = require("express-validator");
const Employee = require("../model/employee.model");
const { createLog } = require("./log.controller");

const checkValidate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return false;
};

//# [POST] /api/v1/user/register
module.exports.register = async (req, res) => {
  const valid = checkValidate(req, res);
  if (valid) {
    return valid;
  }

  try {
    req.body.password = md5(req.body.password);

    // check duplicate email

    const account = await User.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (account) {
      res.json({
        code: 400,
        message: "email already exist",
      });
      return;
    }

    //end check duplicate email

    // create account

    const newAccount = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      token: random(50),
    });

    await newAccount.save();

    res.cookie("token", newAccount.token);

    res.json({
      code: 200,
      message: "success",
      token: newAccount.token,
    });

    //end create account
  } catch (error) {
    res.json({
      code: 400,
      message: "can not signup",
      error,
    });
  }
};

/**
 * ====================================
 * //# [POST] /api/v1/user/login
 * ====================================
 */
module.exports.login = async (req, res) => {
  // let cache = [];

  // Giả lập thêm dữ liệu vào bộ nhớ đệm (cache)
  // cache.push(new Array(1000000).join("*")); // Tạo một chuỗi dài để chiếm bộ nhớ

  const valid = checkValidate(req, res);
  if (valid) {
    return valid;
  }

  try {
    // find account in db

    const account = await User.findOne({
      email: req.body.email,
      deleted: false,
    });

    //end find account in db

    // check exist account
    if (!account) {
      res.json({
        code: 400,
        message: "account does not exist",
      });
      return;
    }
    //end check exist account

    // check passwordcha

    if (md5(req.body.password) != account.password) {
      res.json({
        code: 400,
        message: "password incorrect",
      });
      return;
    }
    //end check password

    const token = account.token;
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000 * 24,
    }); // set token
    createLog("login", req.userId, "user " + account.username + " login");
    res.json({
      code: 200,
      message: "login success",
      user: {
        role: account.role,
        username: account.username,
        status: account.status,
      },
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Can not login",
    });
  }
};

/**
 * ====================================
 * //# [POST] /api/v1/user/password/forgot
 * ====================================
 */
module.exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;

    // find email in db
    const existEmail = await User.findOne({
      email: email,
    });
    // end find email in db

    // check email exist
    if (!existEmail) {
      res.json({
        code: 400,
        message: "email does not exist",
      });
      returns;
    }
    //end check email exist

    // create object forgot password
    const OTP = random.OTP(6);
    const objectForgotPassword = new forgotModel({
      email: email,
      OTP: OTP,
      expireAt: Date.now(),
    });

    await objectForgotPassword.save();

    // end create object forgot password

    // send otp
    const subject = "Your OTP";
    const content = `Your OTP is: <b>${OTP}</b> it will be expired in 3 minutes`;
    sendMail.send(email, subject, content);
    //end send otp

    res.json({
      code: 200,
      message: "send otp success",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
    });
  }
};

//# [POST] /api/v1/user/password/otp
module.exports.otp = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    console.log(email);
    console.log(otp);
    // check email
    const accountForgot = await forgotModel.findOne({
      email: email,
      OTP: otp,
    });

    if (!accountForgot) {
      res.json({
        code: 400,
        message: "OTP is not correct",
      });
      return;
    }
    //end check email

    // get user when otp is correct
    const account = await User.findOne({
      email: email,
    });

    const token = account.token;
    res.cookie("token", token);
    //end  get user when otp is correct

    res.json({
      code: 200,
      message: "success",
      token: token,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
    });
  }
};

//# [POST] /api/v1/user/password/reset
module.exports.reset = async (req, res) => {
  try {
    const token = req.cookies.token;
    const password = req.body.password;

    // check exist account
    const account = await User.findOne({
      token: token,
    });

    if (!account) {
      res.json({
        code: 400,
        message: "account does not exist",
      });
      return;
    }

    const updateData = {
      password: md5(password),
    };

    if (account.status == "Waiting") {
      updateData.status = "OK";
    }

    await User.updateOne(
      {
        token: token,
      },
      updateData
    );
    //end change password

    res.json({
      code: 200,
      message: "success",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "error",
    });
  }
};

//# [GET] /api/v1/user/detail
module.exports.information = async (req, res) => {
  try {
    const token = req.cookies.token;

    //find account
    const account = await User.findOne({
      token: token,
    });

    //end find account

    const employeeInformation = await Employee.findById(
      account.employeeId
    ).populate("department");

    // check exist
    if (!employeeInformation) {
      res.json({
        code: 400,
        message: "account does not exist",
      });
      return;
    }
    //end check exist

    res.json({
      code: 200,
      message: "success",
      information: employeeInformation,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
    });
  }
};
