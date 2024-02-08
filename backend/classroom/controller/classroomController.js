const Classroom = require("../model/classroomModel");
const asyncHandler = require("express-async-handler");
const getClassroom = asyncHandler(async (req, res) => {
  const classroom = await Classroom.find({});
  res.send(classroom).status(200);
});
const getClassroomById = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.id);
  if (!classroom) {
    res.send("Error finding the classroom");
  }
  res.send(classroom).status(200);
});
const postClassroom = asyncHandler(async (req, res) => {
  const { className, totalDesk } = req.body;
  if (!className || !totalDesk) {
    res.send("Please enter all data correctly").status(404);
  }
  const classroom = await Classroom.create({ className, totalDesk });
  res.send(classroom).status(200);
});
const updateClassroom = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!classroom) {
    res.send("classroom not found").status(404);
  }
  res.send(classroom).status(200);
});
const deleteClassroom = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findByIdAndDelete(req.params.id);
  if (!classroom) {
    res.send("classroom not found").status(404);
  }
  res.send(classroom).status(200);
});
module.exports = {
  getClassroom,
  getClassroomById,
  updateClassroom,
  postClassroom,
  deleteClassroom,
};
