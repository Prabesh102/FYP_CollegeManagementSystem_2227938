const mongoose = require("mongoose");
const studentSchema = mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  bookTaken: {
    type: String,
    required: true,
  },
  timeDuration: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Student", studentSchema);
