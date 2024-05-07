const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  sectionName: {
    type: String,
    required: true,
  },
  reviews: [
    {
      teacherName: {
        type: String,
        required: true,
      },
      review: {
        type: Number,
        required: true,
      },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Reviewstore = mongoose.model("Reviewstore", reviewSchema);

module.exports = Reviewstore;
