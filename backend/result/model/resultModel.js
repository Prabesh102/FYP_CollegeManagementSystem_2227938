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
  noOfSubject: {
    type: Number,
    required: true,
  },
  subjects: [
    {
      subjectName: {
        type: String,
        required: true,
      },
      obtainedMarks: {
        type: Number,
        required: true,
      },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ResultModel = mongoose.model("Result", resultSchema);

module.exports = ResultModel;
