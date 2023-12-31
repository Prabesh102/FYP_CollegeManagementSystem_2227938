const express = require("express");
const studentRouter = express.Router();
const {
  getstudents,
  getstudentsById,
  poststudents,
  updatestudents,
  deletestudents,
} = require("../controller/studentController");
studentRouter.get("/", getstudents);
studentRouter.get("/:id", getstudentsById);
studentRouter.post("/", poststudents);
studentRouter.put("/:id", updatestudents);
studentRouter.delete("/:id", deletestudents);
module.exports = studentRouter;
