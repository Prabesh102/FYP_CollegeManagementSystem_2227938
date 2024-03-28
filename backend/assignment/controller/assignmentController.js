const moment = require("moment-timezone");
const File = require("../model/assignmentModel");
const fs = require("fs");
const uploadFile = async (req, res) => {
  try {
    const { filename, path } = req.file;
    const {
      assignmentTitle,
      assignmentDescription,
      startDate,
      endDate,
      course,
      section,
    } = req.body;

    const currentDate = moment().tz("Asia/Kathmandu");

    if (
      moment.tz(startDate, "Asia/Kathmandu").isBefore(currentDate) ||
      moment.tz(endDate, "Asia/Kathmandu").isBefore(currentDate)
    ) {
      return res.status(400).json({
        error: "Start date and end date cannot be earlier than today.",
      });
    }

    const newFile = new File({
      filename,
      path,
      assignmentTitle,
      assignmentDescription,
      startDate,
      endDate,
      course,
      section,
    });

    await newFile.save();

    return res.status(201).json(newFile);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

const updateFile = async (req, res) => {
  try {
    const {
      assignmentTitle,
      assignmentDescription,
      startDate,
      endDate,
      course,
      section,
    } = req.body;

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const currentDate = moment().tz("Asia/Kathmandu");

    if (
      moment.tz(startDate, "Asia/Kathmandu").isBefore(currentDate) ||
      moment.tz(endDate, "Asia/Kathmandu").isBefore(currentDate)
    ) {
      return res.status(400).json({
        error: "Start date and end date cannot be earlier than today.",
      });
    }

    const updatedFile = {
      assignmentTitle,
      assignmentDescription,
      startDate,
      endDate,
      course,
      section,
    };

    if (req.file) {
      // Delete the old file
      fs.unlinkSync(file.path);

      // Update the file details
      updatedFile.filename = req.file.filename;
      updatedFile.path = req.file.path;
    }

    // Update the file in the database
    const updatedFileInDb = await File.findByIdAndUpdate(
      req.params.id,
      updatedFile,
      { new: true }
    );

    return res.status(200).json(updatedFileInDb);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await File.find();
    return res.status(200).json(files);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

const deleteFiles = async (req, res) => {
  try {
    const files = await File.findByIdAndDelete(req.params.id);
    return res.status(200).json(files);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

module.exports = {
  uploadFile,
  getFiles,
  deleteFiles,
  updateFile,
};
