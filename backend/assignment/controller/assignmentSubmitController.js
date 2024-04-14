// controllers/assignmentSubmissionController.js

const AssignmentSubmission = require("../model/assignmentSubmitModel");

exports.submitAssignment = async (req, res) => {
  try {
    const { studentName, moduleName, assignmentId, remarks } = req.body;
    const file = req.file.path; // Assuming multer is used for file upload

    const newSubmission = new AssignmentSubmission({
      studentName,
      moduleName,
      assignmentId,
      file,
      remarks,
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
