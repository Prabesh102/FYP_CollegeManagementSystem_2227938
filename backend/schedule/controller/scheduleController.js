const Schedule = require("../model/scheduleModel");
const asyncHandler = require("express-async-handler");
const getSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.find({});
  res.send(schedule).status(200);
});
const postSchedule = asyncHandler(async (req, res) => {
  const { section, scheduledDay, numberOfClass, scheduledTime, classroom } =
    req.body;
  if (
    !section ||
    !scheduledDay ||
    !numberOfClass ||
    !scheduledTime ||
    !classroom
  ) {
    res.send("please enter all details correctly");
    res.status(404);
  }
  const schedule = await Schedule.create({
    section,
    scheduledDay,
    numberOfClass,
    scheduledTime,
    classroom,
  });
  res.send(schedule).status(200);
});
const getScheduleById = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);
  if (!schedule) {
    res.send("Scheduled class not found").status(404);
  }
  res.send(schedule).status(200);
});
const updateSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!schedule) {
    res.send("Scheduled class not found").status(404);
  }
  res.send(schedule).status(200);
});

const deleteSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findByIdAndDelete(req.params.id);
  if (!schedule) {
    res.send("Scheduled class not found").status(404);
  }
  res.send(schedule).status(200);
});
module.exports = {
  getSchedule,
  getScheduleById,
  postSchedule,
  updateSchedule,
  deleteSchedule,
};
