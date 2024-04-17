const express = require("express");
const resultMakerRouter = express.Router();
const {
  getAllResult,
  createResult,
} = require("../controller/resultController");
resultMakerRouter.get("/", getAllResult);
resultMakerRouter.post("/", createResult);
module.exports = resultMakerRouter;
