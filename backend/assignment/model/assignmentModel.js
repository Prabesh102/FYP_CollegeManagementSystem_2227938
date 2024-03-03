const mongoose = require("mongoose");

const File = mongoose.model("File", {
  filename: String,
  path: String,
  assignmentTitle: String,
  assignmentDescription: String,
});

module.exports = File;
