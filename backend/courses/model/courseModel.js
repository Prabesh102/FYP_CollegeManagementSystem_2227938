const mongoose = require("mongoose");
const courseSchema = mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Please enter name"],
    },

    totalCredits: {
      type: Number,
      required: [true, "please enter total credits"],
    },
    modules: {
      type: Number,
      required: [true, "Please enter the modules numbers"],
    },
    totalStudentsAllocated: {
      type: Number,
      required: [
        true,
        "please enter the total number of students that can be allocated to this course",
      ],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Course", courseSchema);
