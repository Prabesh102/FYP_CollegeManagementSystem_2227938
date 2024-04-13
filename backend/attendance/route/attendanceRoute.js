const express = require("express");
const attendanceRouter = express.Router();
const attendanceController = require("../controller/attendanceController");

// Endpoint to store attendance
attendanceRouter.post("/attendance", attendanceController.recordAttendance);
attendanceRouter.get(
  "/getAllAttendance",
  attendanceController.getAllAttendance
);
attendanceRouter.get(
  "/getAttendanceByTeacherName",
  attendanceController.getAttendanceByTeacherName
);
attendanceRouter.put(
  "/updateAttendance",
  attendanceController.updateAttendance
);
attendanceRouter.get(
  "/getAttendanceByTeacherNameDateAndSection",
  attendanceController.getAttendanceByTeacherNameDateAndSection
);

module.exports = attendanceRouter;
