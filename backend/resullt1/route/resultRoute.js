const express = require("express");
const resultMakerRouter = express.Router();
const {
  getAllResult,
  createResult,
  getResultByStudentName,
  getResultByStudentAndSubmission,
} = require("../controller/resultController");
resultMakerRouter.get("/", getResultByStudentName);

resultMakerRouter.get("/", getAllResult);
resultMakerRouter.post("/", createResult);
resultMakerRouter.get("/student/", getResultByStudentAndSubmission);
module.exports = resultMakerRouter;
