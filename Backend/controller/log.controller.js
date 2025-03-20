const Log = require("../model/log.model");

module.exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .populate("performedBy")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      data: logs,
    });
  } catch (error) {
    console.error("Error creating log:", error);
    return res.status(500).json({
      error,
      message: "There was an error",
    });
  }
};

module.exports.createLog = async (action, performedBy, details) => {
  try {
    // Tạo một đối tượng log mới
    const newLog = new Log({
      action,
      performedBy,
      details,
    });

    // Lưu log vào cơ sở dữ liệu
    const savedLog = await newLog.save();
    console.log("Log saved successfully:", savedLog);
  } catch (error) {
    console.error("Error creating log:", error);
    return res.status(500).json({
      error,
      message: "There was an error",
    });
  }
};
