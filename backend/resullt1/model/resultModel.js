const mongoose = require("mongoose");

const resultSchema = mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  studentSection: {
    type: String,
    required: true,
  },
  moduleName: {
    type: String,
    required: true,
  },
  totalMark: {
    type: Number,
    required: true,
  },
  obtainedMark: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ResultModel = mongoose.model("ResultMaker", resultSchema);

module.exports = ResultModel;
