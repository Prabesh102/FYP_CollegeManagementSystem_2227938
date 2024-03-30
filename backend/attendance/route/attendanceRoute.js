const express = require("express");
const attendanceRouter = express.Router();
const attendanceController = require("../controller/attendanceController");

// Endpoint to store attendance
attendanceRouter.post("/attendance", attendanceController.recordAttendance);
attendanceRouter.get(
  "/getAllAttendance",
  attendanceController.getAllAttendance
);
module.exports = attendanceRouter;
