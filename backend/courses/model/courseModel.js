const mongoose = require("mongoose");

const moduleSchema = mongoose.Schema({
  moduleName: {
    type: String,
    required: true,
  },
});

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
    modules: [moduleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
