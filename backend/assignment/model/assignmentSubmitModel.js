const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  moduleName: {
    type: String,
    required: true,
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  remarks: String,
  assignmentTitle: {
    type: String,
  },
  studentSection: {
    type: String,
  },
  totalMark: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const AssignmentSubmission = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);

module.exports = AssignmentSubmission;
