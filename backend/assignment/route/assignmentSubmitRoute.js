const express = require("express");
const router = express.Router();
const assignmentSubmissionController = require("../controller/assignmentSubmitController");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename with the original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

// Set up multer for file upload with custom storage
const upload = multer({ storage: storage });

router.post(
  "/submit",
  upload.single("file"),
  assignmentSubmissionController.submitAssignment
);
router.get(
  "/module/:module",
  assignmentSubmissionController.getAssignmentsByModule
);
router.get(
  "/submissions/:assignmentId",
  assignmentSubmissionController.getSubmissionsByAssignmentId
);
router.get(
  "/submissions/:assignmentId/:section",
  assignmentSubmissionController.getSubmissionsByAssignmentIdAndSection
);
router.get(
  "/submissions/student/:studentName",
  assignmentSubmissionController.getSubmissionsByStudentName
);
module.exports = router;
