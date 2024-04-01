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
          startTime: {
            type: String,
            required: true,
          },
          endTime: {
            type: String,
            required: true,
          },
          teacher: {
            type: String,
            required: true,
          },
          classType: {
            type: String,
            enum: ["tutorial", "workshop", "lecture"],
            required: true,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Schedule", scheduleSchema);
