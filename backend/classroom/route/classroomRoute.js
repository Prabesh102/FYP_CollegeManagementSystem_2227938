const express = require("express");
const classroomRouter = express.Router();
const {
  getClassroom,
  getClassroomById,
  postClassroom,
  updateClassroom,
  deleteClassroom,
} = require("../controller/classroomController");
classroomRouter.get("/", getClassroom);
classroomRouter.get("/:id", getClassroomById);
classroomRouter.post("/", postClassroom);
classroomRouter.put("/:id", updateClassroom);
classroomRouter.delete("/:id", deleteClassroom);
module.exports = classroomRouter;
