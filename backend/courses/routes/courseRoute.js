const express = require("express");
const courseRouter = express.Router();
const {
  getCourse,
  getCourseById,
  postCourse,
  updateCourse,
  deleteCourse,
  getModulesForCourse,
} = require("../controller/courseController");
courseRouter.get("/getAllCourse", getCourse);
courseRouter.get("/getCourseById/:id", getCourseById);
courseRouter.post("/postCourse", postCourse);
courseRouter.put("/updateCourse/:id", updateCourse);
courseRouter.delete("/deleteCourse/:id", deleteCourse);
courseRouter.get("/:id/modules", getModulesForCourse);
module.exports = courseRouter;
