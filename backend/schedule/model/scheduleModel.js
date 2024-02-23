const mongoose = require("mongoose");
const scheduleSchema = mongoose.Schema({
  section: {
    type: String,
    required: true,
  },
  scheduledDay: {
    type: String,
    required: true,
  },
  numberOfClass: {
    type: Number,
    required: true,
  },
  scheduledTime: {
    type: String,
    required: true,
  },
  classroom: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Schedule", scheduleSchema);
