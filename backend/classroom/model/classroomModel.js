const mongoose = require("mongoose");
const classroomSchema = mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  totalDesk: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("Classroom", classroomSchema);
