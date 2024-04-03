const mongoose = require("mongoose");
const attendanceSchema = mongoose.Schema({
  section: {
    type: String,
    required: true,
  },
  teacherName: {
    type: String,
  },
  studentName: {
    type: String,
    required: true,
  },

  present: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
