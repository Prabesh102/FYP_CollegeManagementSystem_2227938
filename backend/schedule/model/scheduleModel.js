const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema({
  section: {
    type: String,
    required: true,
  },
  scheduleDetails: [
    {
      scheduledDay: {
        type: String,
        required: true,
      },
      numberOfClass: {
        type: Number,
        required: true,
      },
      classrooms: [
        {
          classroom: {
            type: String,
            required: true,
          },
          time: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Schedule", scheduleSchema);
