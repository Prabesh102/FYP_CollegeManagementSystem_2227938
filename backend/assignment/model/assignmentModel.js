const mongoose = require("mongoose");

const File = mongoose.model("File", {
  filename: String,
  path: String,
  assignmentTitle: String,
  assignmentDescription: String,
  startDate: Date,
  endDate: Date,
  course: String,
  section: String,
});

module.exports = File;
