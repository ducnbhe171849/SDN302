const express = require("express");
const fs = require("fs-extra");
const Employee = require("../../../model/employee.model");
const isAuthenticated = require("../../../middlewares/employee/isAuthenticate.middleware");
const isAdminRole = require("../../../middlewares/employee/isAdminRole.middleware");
const models = require("../../../model");
const { createLog } = require("../../../controller/log.controller");
const router = new express.Router();

/**
 * ====================================
 * [GET] /backup
 * ====================================
 */
router.get("/", isAuthenticated, isAdminRole, async (req, res) => {
  try {
    for (const modelName in models) {
      const model = models[modelName];
      const data = await model.find(); // Lấy tất cả dữ liệu từ collection
      fs.writeFileSync(
        `backup-${modelName}.json`,
        JSON.stringify(data, null, 2)
      ); // Lưu dữ liệu vào file JSON
    }

    createLog("Backup", req.userId, "Backup data");

    return res.json({
      code: 200,
      data: {
        message: "Backup success",
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Backup failed",
    });
  }
});

/**
 * ====================================
 * [GET] /backup/restore
 * ====================================
 */
router.get("/restore", isAuthenticated, isAdminRole, async (req, res) => {
  try {
    try {
      for (const modelName in models) {
        const model = models[modelName];
        const data = fs.readFileSync(`backup-${modelName}.json`, "utf-8");
        const jsonData = JSON.parse(data);

        for (const record of jsonData) {
          // Kiểm tra xem bản ghi đã tồn tại chưa, nếu chưa thì thêm mới
          const exists = await model.exists({ _id: record._id });
          if (!exists) {
            await model.create(record); // Thêm bản ghi mới vào database
          }
        }
      }

      createLog("Restore", req.userId, "Restore data");

      return res.json({
        code: 200,
        data: {
          message: "Restore success",
        },
      });
    } catch (error) {
      console.error("Error restoring data:", error);
    }
  } catch (error) {
    console.error("Error during restore:", error);
  }
});

module.exports = router;
