const mongoose = require("mongoose");
const noticeSchema = mongoose.Schema({
  noticeTitle: {
    type: String,
    required: true,
  },
  noticeDescription: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Notice", noticeSchema);
