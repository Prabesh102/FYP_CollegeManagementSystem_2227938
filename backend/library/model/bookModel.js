const mongoose = require("mongoose");
const bookSchema = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  bookName: {
    type: String,
    required: true,
  },
  bookCategory: {
    type: String,
    required: true,
  },
  bookPrice: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  selfNo: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("Book", bookSchema);
