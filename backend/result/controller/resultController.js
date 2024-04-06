const Result = require("../model/resultModel");
const asyncHandler = require("express-async-handler");

// Function to fetch all results
const getAllResult = asyncHandler(async (req, res) => {
  const results = await Result.find({});
  res.status(200).json(results);
});

// Function to create a new result
const createResult = asyncHandler(async (req, res) => {
  const { studentName, studentSection, noOfSubject, subjects } = req.body;

  // Validate the incoming data
  if (
    !studentName ||
    !studentSection ||
    !noOfSubject ||
    !subjects ||
    subjects.length !== noOfSubject
  ) {
    res.status(400).json({
      message:
        "Invalid request. Please provide studentName, studentSection, noOfSubject, and subjects array with corresponding data.",
    });
    return;
  }

  try {
    const result = new Result({
      studentName,
      studentSection,
      noOfSubject,
      subjects,
    });
    const savedResult = await result.save();
    res.status(201).json(savedResult);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create result.", error: error.message });
  }
});

module.exports = { getAllResult, createResult };
