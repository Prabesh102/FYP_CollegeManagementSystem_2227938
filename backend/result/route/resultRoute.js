const express = require("express");
const resultRouter = express.Router();
const {
  getAllResult,
  createResult,
} = require("../controller/resultController");
resultRouter.get("/", getAllResult);
resultRouter.post("/", createResult);
module.exports = resultRouter;
