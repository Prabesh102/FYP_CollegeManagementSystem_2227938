const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    filename: String,
    path: String,
    assignmentTitle: String,
    assignmentDescription: String,
    startDate: Date,
    endDate: Date,
    course: String,
    section: String,
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
