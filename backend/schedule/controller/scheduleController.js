const Schedule = require("../model/scheduleModel");
const asyncHandler = require("express-async-handler");
const getSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.find({});
  res.send(schedule).status(200);
});
const postSchedule = asyncHandler(async (req, res) => {
  const { section, scheduleDetails } = req.body;

  if (!section || !scheduleDetails || scheduleDetails.length === 0) {
    res.status(400).json({ message: "Please enter all details correctly" });
    return;
  }

  const schedule = await Schedule.create({
    section,
    scheduleDetails,
  });

  res.status(201).json(schedule);
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
