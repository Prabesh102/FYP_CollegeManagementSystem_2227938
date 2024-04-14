const express = require("express");
const router = express.Router();
const assignmentSubmissionController = require("../controller/assignmentSubmitController");
const multer = require("multer");

// Set up multer for file upload
const upload = multer({ dest: "uploads/" });

router.post(
  "/submit",
  upload.single("file"),
  assignmentSubmissionController.submitAssignment
);
router.get(
  "/module/:module",
  assignmentSubmissionController.getAssignmentsByModule
);

module.exports = router;
