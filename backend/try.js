const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path"); // Import the 'path' module

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

mongoose.connect(
  "mongodb+srv://prabesh:prabesh@fyp.ubddnoe.mongodb.net/CMS?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const File = mongoose.model("File", {
  filename: String,
  path: String,
  assignmentTitle: String,
  assignmentDescription: String,
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { filename, path } = req.file;
    const { assignmentTitle, assignmentDescription } = req.body; // Extract additional fields from the request body
    const newFile = new File({
      filename,
      path,
      assignmentTitle,
      assignmentDescription,
    });
    await newFile.save();
    res.setHeader("Content-Type", "application/octet-stream");

    return res.status(201).json(newFile);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
});
app.get("/files", async (req, res) => {
  try {
    const files = await File.find();
    return res.status(200).json(files);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
