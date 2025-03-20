const express = require("express");

const controller = require("../../../controller/log.controller");

const router = new express.Router();

router.get("/", controller.getLogs);

module.exports = router;
