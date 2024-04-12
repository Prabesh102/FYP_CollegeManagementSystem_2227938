const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  uploadFile,
  getFiles,
  deleteFiles,
  updateFile,
  getFilesByTeacherName,
} = require("../controller/assignmentController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), uploadFile);
router.get("/files", getFiles);
router.get("/files/:filename", (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(__dirname, `../uploads/${filename}`));
});
router.delete("/deleteFile/:id", deleteFiles);
router.put("/updateFile/:id", upload.single("file"), updateFile); // Update route with multer upload middleware
module.exports = router;
