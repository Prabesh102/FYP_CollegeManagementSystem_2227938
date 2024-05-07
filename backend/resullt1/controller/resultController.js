const ResultMaker = require("../model/resultModel");
const asyncHandler = require("express-async-handler");

// Function to fetch all results
const getAllResult = asyncHandler(async (req, res) => {
  const results = await ResultMaker.find({});
  res.status(200).json(results);
});

// Function to create a new result
const createResult = asyncHandler(async (req, res) => {
  const {
    studentName,
    studentSection,
    moduleName,
    totalMark,
    obtainedMark,
    submissionId,
  } = req.body;
  console.log(
    studentName,
    studentSection,
    moduleName,
    totalMark,
    obtainedMark,
    submissionId
  );

  // Validate the incoming data
  if (
    !studentName ||
    !studentSection ||
    !moduleName ||
    !totalMark ||
    !obtainedMark ||
    !submissionId
  ) {
    res.status(400).json({
      message:
        "Invalid request. Please provide studentName, studentSection, moduleName, totalMark, obtainedMark, and submissionId.",
    });
    return;
  }

  try {
    const result = new ResultMaker({
      studentName,
      studentSection,
      moduleName,
      totalMark,
      obtainedMark,
      submissionId,
    });
    const savedResult = await result.save();
    res.status(201).json(savedResult);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create result.", error: error.message });
  }
});

const getResultByStudentName = asyncHandler(async (req, res) => {
  const { studentName } = req.query;
  try {
    const result = await ResultMaker.findOne({ studentName });
    if (!result) {
      res.status(404).json({ message: "Result not found for the student" });
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch result", error: error.message });
  }
});

const getResultByStudentAndSubmission = asyncHandler(async (req, res) => {
  const { studentName, submissionId } = req.query;
  try {
    const result = await ResultMaker.findOne({ studentName, submissionId });
    if (!result) {
      res
        .status(404)
        .json({ message: "Result not found for the student and submission" });
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch result", error: error.message });
  }
});

module.exports = {
  getAllResult,
  createResult,
  getResultByStudentName,
  getResultByStudentAndSubmission,
};
