const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema({
  section: {
    type: String,
    required: true,
  },
  startDateTime: {
    type: Date,
    required: true,
  },
  endDateTime: {
    type: Date,
    required: true,
  },
});

const Review = mongoose.model("Review", scheduleSchema);

module.exports = {
  Review,
};
