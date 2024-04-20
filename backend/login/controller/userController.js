const asyncHandler = require("express-async-handler");
const express = require("express");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const { sendEmail } = require("./sendEmail");
const userRegister = asyncHandler(async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      registrationDate,
      semester,
      sections,
      course,
      module,
    } = req.body;
    if (
      !username ||
      !email ||
      !password ||
      !role ||
      !registrationDate ||
      !sections ||
      !course
    ) {
      return res.status(400).send("Please enter all details correctly");
    }

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      return res
        .status(400)
        .send("User is already registered, please use a new email");
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      // password: hashedPassword,
      password,
      role,
      registrationDate,
      semester,
      sections: req.body.sections,
      course,
      module,
    });

    console.log("User created successfully: - ", newUser);

    // Send email with user's entered email and password
    const emailSent = await sendEmail(
      email,
      "Registration Details",
      `Thank you for registering!\nEmail: ${email}\nPassword: ${password} \nSection: ${sections[0]}`
    );

    if (emailSent) {
      return res.status(201).json({
        _id: newUser.id,
        email: newUser.email,
      });
    } else {
      // If email fails to send, delete the created user
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({ error: "Failed to send welcome email" });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
});

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Please enter correct email or password" });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    // Authenticate the user by comparing the password
    // const isPasswordMatch = await bcrypt.compare(password, user.password);
    // if (!isPasswordMatch) {
    if (password !== user.password) {
      res.status(400).json({ error: "Incorrect password" });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        semester: user.semester,
        role: user.role,
        section: user.section,
        course: user.course,
        sections: user.sections,
        module: user.module,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1h" }
    );

    // Send the token along with the user's role
    res.status(200).json({
      token,
      role: user.role,
      username: user.username,
      semester: user.semester,
      section: user.section,
      course: user.course,
      sections: user.sections,
      module: user.module,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const countUsersByRole = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: "student" });
    const teacherCount = await User.countDocuments({ role: "teacher" });

    res.status(200).json({ studentCount, teacherCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const getRecentlyRegisteredUsers = async (req, res) => {
  try {
    const recentlyRegisteredUsers = await User.find({})
      .sort({ registrationDate: -1 }) // Sort by registration date in descending order to get the most recent users first
      .limit(2); // Adjust this limit as needed to get the desired number of recent users

    res.status(200).json(recentlyRegisteredUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const updatePassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the password
    user.password = newPassword;

    // Save the updated user
    const updatedUser = await user.save();

    // Check if the save operation was successful
    if (updatedUser) {
      console.log("Password updated successfully:", updatedUser);
      return res.status(200).json({ message: "Password updated successfully" });
    } else {
      return res.status(500).json({ error: "Password update failed" });
    }
  } catch (error) {
    console.error("Password update failed:", error.message);
    return res.status(500).json({ error: "Password update failed" });
  }
};
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).sort({
      registrationDate: -1,
    }); // Sort by registration date in descending order
    // .select("_id username email registrationDate section year semester");

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateUserDetails = async (req, res) => {
  try {
    const {
      userId,
      updatedName,
      updatedEmail,
      updatedSemester,
      updatedSection,
      updatedModule,
    } = req.body;

    // Find the user by userId and update the details
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user details
    user.username = updatedName;
    user.email = updatedEmail;
    user.semester = updatedSemester;
    user.section = updatedSection;
    user.module = updatedModule;
    // Save the updated user
    await user.save();

    return res
      .status(200)
      .json({ message: "User details updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
const deleteUser = async (req, res) => {
  const userId = req.params.id; // Assuming you're passing user ID in the route

  try {
    // Use your User model to find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getAllTeachers = async (req, res) => {
  try {
    // Find all users with the role 'teacher'
    const teachers = await User.find({ role: "teacher" });
    // .select(
    //   "_id username email course section registrationDate"
    // );

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const students = await User.find({ role: "admin" })
      .sort({ registrationDate: -1 }) // Sort by registration date in descending order
      .select("_id username email registrationDate");

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const getStudentsBySection = async (req, res) => {
  try {
    const { section } = req.query;

    if (!section) {
      return res.status(400).json({ error: "Section parameter is required" });
    }

    const students = await User.find({
      role: "student",
      sections: { $in: [section] },
    })
      .sort({ registrationDate: -1 })
      .select("_id username email registrationDate sections semester");

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllTeachers,
  deleteUser,
  updateUserDetails,
  updatePassword,
  userRegister,
  userLogin,
  countUsersByRole,
  getRecentlyRegisteredUsers,
  getAllStudents,
  getAllAdmins,
  getStudentsBySection,
};
