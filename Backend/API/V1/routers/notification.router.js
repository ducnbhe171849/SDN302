const express = require("express");
const isAuthenticated = require("../../../middlewares/employee/isAuthenticate.middleware");
const isAdminRole = require("../../../middlewares/employee/isAdminRole.middleware");
const controller = require("../../../controller/notification.controller");

const router = new express.Router();

/**
 * ====================================
 * [POST] /notification
 * ====================================
 */
router.post("/", isAuthenticated, isAdminRole, controller.createNotification);

/**
 * ====================================
 * [GET] /notification
 * ====================================
 */
router.get("/", isAuthenticated, controller.getNotification);

module.exports = router;
