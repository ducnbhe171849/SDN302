const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Employee"], // Vai trò có thể là Admin hoặc Employee
      required: true,
      default: "Employee",
    },

    token: {
      type: String,
      required: true,
    },

    deleted: {
      type: Boolean,
      default: false,
    },

    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee", // Liên kết đến Employee nếu người dùng là nhân viên
    },

    status: {
      type: String,
      enum: ["Banned", "Waiting", "OK"],
      default: "OK",
    },

    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
