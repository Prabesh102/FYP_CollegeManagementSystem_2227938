const Course = require("../model/courseModel");
const asyncHandler = require("express-async-handler");
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.find({});
  res.send(course).status(200);
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.find(req.params.id);
  if (!course) {
    res.send("course not found");
  }
  res.send(course).status(200);
});

const postCourse = asyncHandler(async (req, res) => {
  const { courseName, totalCredits, modules, totalStudentsAllocated } =
    req.body;
  if (!courseName || !totalCredits || !modules || !totalStudentsAllocated) {
    res.send("Please enter all the fields");
  }
  const course = await Course.create({
    courseName,
    totalCredits,
    modules,
    totalStudentsAllocated,
  });
  res.send(course).status(201);
});
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!course) {
    res.send("course not found");
  }
  res.send(course).status(200);
});
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    res.send("Course not found").status(400);
  }
  res.send(course).status(200);
});
module.exports = {
  getCourse,
  getCourseById,
  postCourse,
  updateCourse,
  deleteCourse,
};
