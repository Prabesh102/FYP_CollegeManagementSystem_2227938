const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    teacherName: String,
    filename: String,
    path: String,
    assignmentTitle: String,
    assignmentDescription: String,
    startDate: Date,
    endDate: Date,
    course: String,
    section: String,
    module: String,
    mark: Number,
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
