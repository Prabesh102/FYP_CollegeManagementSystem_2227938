const express = require("express");
const scheduleRouter = express.Router();
const {
  getSchedule,
  getScheduleById,
  updateSchedule,
  postSchedule,
  deleteSchedule,
  getSectionsByTeacher,
  getScheduleSection,
  getScheduleDetails,
} = require("../controller/scheduleController");

scheduleRouter.get("/getAllSchedule", getSchedule);
scheduleRouter.get("/teacher/:teacherUsername/sections", getSectionsByTeacher);
scheduleRouter.get("/:id", getScheduleById);
scheduleRouter.get("/findBysection/:sectionName", getScheduleSection);
// Update the route definition to include the current day and time parameters
scheduleRouter.get("/", getScheduleDetails);

scheduleRouter.put("/:id", updateSchedule);
scheduleRouter.post("/", postSchedule);
scheduleRouter.delete("/:id", deleteSchedule);

module.exports = scheduleRouter;
