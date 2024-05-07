// controllers/assignmentSubmissionController.js

const AssignmentSubmission = require("../model/assignmentSubmitModel");

exports.submitAssignment = async (req, res) => {
  try {
    const {
      studentName,
      moduleName,
      assignmentId,
      remarks,
      assignmentTitle,
      studentSection,
      totalMark,
    } = req.body;
    const file = req.file.path; // Assuming multer is used for file upload

    const newSubmission = new AssignmentSubmission({
      studentName,
      moduleName,
      assignmentId,
      file,
      remarks,
      assignmentTitle,
      studentSection,
      totalMark,
    });

    await newSubmission.save();

    res.status(201).json({ message: "Assignment submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit assignment" });
  }
};
exports.getAssignmentsByModule = async (req, res) => {
  try {
    const { module } = req.params;
    const assignments = await AssignmentSubmission.find({ moduleName: module });
    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
};
exports.getSubmissionsByAssignmentId = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await AssignmentSubmission.find({ assignmentId });
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};
exports.getSubmissionsByAssignmentIdAndSection = async (req, res) => {
  try {
    const { assignmentId, section } = req.params;
    // const { section } = req.query;
    let submissions;
    if (section) {
      submissions = await AssignmentSubmission.find({
        assignmentId,
        studentSection: section,
      });
    } else {
      submissions = await AssignmentSubmission.find({ assignmentId });
    }
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};
exports.getSubmissionsByStudentName = async (req, res) => {
  try {
    const { studentName } = req.params;
    const submissions = await AssignmentSubmission.find({ studentName });
    if (!submissions) {
      console.log("No submission by student");
    }
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch student submissions" });
  }
};
