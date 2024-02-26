const mongoose = require("mongoose");
const sectionSchema = mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: [true, "Please enter name"],
    },

    totalStudents: {
      type: Number,
      required: [true, "please enter total students"],
    },
    course: {
      type: String,
      required: [true, "please enter the course name"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Section", sectionSchema);
