const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter name"],
    },

    email: {
      type: String,
      required: [true, "please enter email"],
    },
    password: {
      type: String,
      required: [true, "Please enter the password"],
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    year: {
      type: Number,
      default: 1,
      required: false,
    },
    semester: {
      type: Number,
      default: 1,
      required: false,
    },
    course: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
