const express = require("express");
const courseRouter = express.Router();
const {
  getCourse,
  getCourseById,
  postCourse,
  updateCourse,
  deleteCourse,
} = require("../controller/courseController");
courseRouter.get("/getAllCourse", getCourse);
courseRouter.get("/getCourseById/:id", getCourseById);
courseRouter.post("/postCourse", postCourse);
courseRouter.put("/updateCourse/:id", updateCourse);
courseRouter.delete("/deleteCourse/:id", deleteCourse);
module.exports = courseRouter;
