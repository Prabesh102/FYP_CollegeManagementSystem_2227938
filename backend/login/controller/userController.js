const asyncHandler = require("express-async-handler");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const { sendEmail } = require("./sendEmail");
const userRegister = asyncHandler(async (req, res) => {
  try {
    const { username, email, password, role, registrationDate } = req.body;
    if (!username || !email || !password || !role || !registrationDate) {
      return res.status(400).send("Please enter all details correctly");
    }

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      return res
        .status(400)
        .send("User is already registered, please use a new email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      registrationDate,
    });

    console.log("User created successfully: - ", newUser);

    // Send email with user's entered email and password
    const emailSent = await sendEmail(
      email,
      "Registration Details",
      `Thank you for registering!\nEmail: ${email}\nPassword: ${password}`
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
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1h" } // Token expiration time
      );
      res.status(200).json({ token, role: user.role }); // Send the role along with the token
    } else {
      res.status(400).json({ error: "Email or password not valid" });
    }
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
      .limit(3); // Adjust this limit as needed to get the desired number of recent users

    res.status(200).json(recentlyRegisteredUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  countUsersByRole,
  getRecentlyRegisteredUsers,
};
