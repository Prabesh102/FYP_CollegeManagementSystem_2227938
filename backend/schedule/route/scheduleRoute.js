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
  getOngoingAndUpcomingClasses,
  getScheduleForTeacherAndClass,
  getScheduleForTeacher,
} = require("../controller/scheduleController");

scheduleRouter.get("/getAllSchedule", getSchedule);
scheduleRouter.get("/teacher/:teacherUsername/sections", getSectionsByTeacher);
scheduleRouter.get("/findBysection/:sectionName", getScheduleSection);
// Update the route definition to include the current day and time parameters
scheduleRouter.get("/", getScheduleDetails);

scheduleRouter.get("/classes/teacher", getOngoingAndUpcomingClasses);
scheduleRouter.get("/:id", getScheduleById);
scheduleRouter.put("/:id", updateSchedule);
scheduleRouter.post("/", postSchedule);
scheduleRouter.delete("/:id", deleteSchedule);
scheduleRouter.get("/schedule/teacher", getScheduleForTeacher);
module.exports = scheduleRouter;
