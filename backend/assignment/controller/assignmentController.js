const moment = require("moment-timezone");
const File = require("../model/assignmentModel");
const fs = require("fs");
const { log } = require("console");
const uploadFile = async (req, res) => {
  try {
    const { filename, path } = req.file;
    const {
      teacherName,
      assignmentTitle,
      assignmentDescription,
      startDate,
      endDate,
      course,
      section,
      module,
      mark,
    } = req.body;
    console.log(req.body);
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
      teacherName,
      filename,
      path,
      assignmentTitle,
      assignmentDescription,
      startDate,
      endDate,
      course,
      section,
      module,
      mark,
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
    let query = {}; // Initialize an empty query object

    // Check if filter by module is requested
    if (req.query.module) {
      query.module = req.query.module; // Add module filter to the query
    }

    // Check if filter by logged-in user name is requested
    if (req.query.teacherName) {
      query.teacherName = req.query.teacherName; // Add teacherName filter to the query
    }

    const files = await File.find(query).sort({ createdAt: -1 });
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
const getLastAssignmentByModule = async (req, res) => {
  try {
    const { module } = req.params;
    const lastAssignment = await File.findOne({ module }).sort({
      createdAt: -1,
    });
    return res.status(200).json(lastAssignment);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};
const getSecondLastAssignmentByModule = async (req, res) => {
  try {
    const { module } = req.params;
    const secondLastAssignment = await File.findOne({ module })
      .sort({
        createdAt: -1,
      })
      .skip(1);
    return res.status(200).json(secondLastAssignment);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};
const getLastAssignmentByTeacherAndModule = async (req, res) => {
  try {
    const { teacherName, module } = req.params;
    const lastAssignment = await File.findOne({ teacherName, module }).sort({
      createdAt: -1,
    });
    return res.status(200).json(lastAssignment);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

const getSecondLastAssignmentByTeacherAndModule = async (req, res) => {
  try {
    const { teacherName, module } = req.params;
    const secondLastAssignment = await File.findOne({ teacherName, module })
      .sort({
        createdAt: -1,
      })
      .skip(1);
    return res.status(200).json(secondLastAssignment);
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
  getLastAssignmentByModule,
  getSecondLastAssignmentByModule,
  getLastAssignmentByTeacherAndModule,
  getSecondLastAssignmentByTeacherAndModule,
};
