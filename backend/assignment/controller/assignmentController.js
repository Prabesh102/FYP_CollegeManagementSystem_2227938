const File = require("../model/assignmentModel");

const uploadFile = async (req, res) => {
  try {
    const { filename, path } = req.file;
    const { assignmentTitle, assignmentDescription } = req.body;
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

module.exports = {
  uploadFile,
  getFiles,
};
