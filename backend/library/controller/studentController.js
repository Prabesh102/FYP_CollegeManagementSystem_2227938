const Student = require("../model/studentsModel");
const asyncHandler = require("express-async-handler");
const getstudents = asyncHandler(async (req, res) => {
  const students = await Student.find({});
  res.send(students).status(200);
});
const getstudentsById = asyncHandler(async (req, res) => {
  const students = await Student.findById(req.params.id);
  if (!students) {
    res.json({ message: "Id not found" });
    res.status(404);
  }
  res.send(students).status(200);
});
const poststudents = asyncHandler(async (req, res) => {
  const { studentName, level, group, bookTaken, timeDuration } = req.body;
  if (!studentName || !level || !group || !bookTaken || !timeDuration) {
    res.json({ message: "Please enter all the  data correctly" });
    res.status(404);
  }
  const students = await Student.create({
    studentName,
    level,
    group,
    bookTaken,
    timeDuration,
  });
  res.send(students).status(200);
});
const updatestudents = asyncHandler(async (req, res) => {
  const students = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!students) {
    res.send("Student not found");
    res.status(404);
  }
  res.send(students).status(200);
});
const deletestudents = asyncHandler(async (req, res) => {
  const students = await Student.findByIdAndDelete(req.params.id);
  if (!students) {
    res.send("students not found");
    res.status(404);
  }
  res.send(students).status(200);
});
module.exports = {
  getstudents,
  getstudentsById,
  poststudents,
  updatestudents,
  deletestudents,
};
