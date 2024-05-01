const express = require("express");
const resultMakerRouter = express.Router();
const {
  getAllResult,
  createResult,
  getResultByStudentName,
} = require("../controller/resultController");
resultMakerRouter.get("/", getResultByStudentName);

resultMakerRouter.get("/", getAllResult);
resultMakerRouter.post("/", createResult);

module.exports = resultMakerRouter;
