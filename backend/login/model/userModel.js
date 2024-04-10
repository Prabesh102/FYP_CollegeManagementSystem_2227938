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

    semester: {
      type: Number,
      default: 1,
      required: false,
    },
    course: {
      type: String,
      required: true,
    },
    sections: {
      type: [String],
      required: true,
    },
    module: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
