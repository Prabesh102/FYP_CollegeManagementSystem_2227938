const express = require("express");
const scheduleRouter = express.Router();
const {
  getSchedule,
  getScheduleById,
  updateSchedule,
  postSchedule,
  deleteSchedule,
} = require("../controller/scheduleController");
scheduleRouter.get("/", getSchedule);
scheduleRouter.get("/:id", getScheduleById);
scheduleRouter.put("/:id", updateSchedule);
scheduleRouter.post("/", postSchedule);
scheduleRouter.delete("/:id", deleteSchedule);
module.exports = scheduleRouter;
