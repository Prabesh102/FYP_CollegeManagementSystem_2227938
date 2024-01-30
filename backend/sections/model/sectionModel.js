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
  },
  { timestamps: true }
);
module.exports = mongoose.model("Section", sectionSchema);
