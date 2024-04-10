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
  const { courseName, totalCredits, totalModules, modules } = req.body;

  if (!courseName || !totalCredits || !totalModules || !modules) {
    return res.status(400).send("Please enter all the fields");
  }

  const courseModules = [];

  // Loop through the totalModules and add module names
  for (let i = 1; i <= totalModules; i++) {
    const moduleName =
      modules[i - 1] && modules[i - 1].moduleName
        ? modules[i - 1].moduleName
        : `Module ${i}`;

    courseModules.push({
      moduleName,
      // Add other module properties as needed
    });
  }

  const course = await Course.create({
    courseName,
    totalCredits,
    modules: courseModules,
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
const getModulesForCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  res.json({ modules: course.modules });
});
module.exports = {
  getCourse,
  getCourseById,
  postCourse,
  updateCourse,
  deleteCourse,
  getModulesForCourse,
};
