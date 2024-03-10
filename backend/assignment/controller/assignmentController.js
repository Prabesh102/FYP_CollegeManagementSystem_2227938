const moment = require("moment-timezone");
const File = require("../model/assignmentModel");

const uploadFile = async (req, res) => {
  try {
    const { filename, path } = req.file;
    const { assignmentTitle, assignmentDescription, startDate, endDate } =
      req.body;

    console.log("Received Start Date:", startDate);
    console.log("Received End Date:", endDate);

    // Check if the current date is within the portal's start and end dates
    const currentDate = moment().tz("Asia/Kathmandu");
    console.log("Current Date:", currentDate.format());
    console.log("Start Date:", moment.tz(startDate, "Asia/Kathmandu").format());
    console.log("End Date:", moment.tz(endDate, "Asia/Kathmandu").format());

    if (
      currentDate.isBefore(moment.tz(startDate, "Asia/Kathmandu")) ||
      currentDate.isAfter(moment.tz(endDate, "Asia/Kathmandu"))
    ) {
      console.log("Portal not accessible");
      return res
        .status(403)
        .json({ error: "Portal is not accessible at the moment." });
    }

    const newFile = new File({
      filename,
      path,
      assignmentTitle,
      assignmentDescription,
      startDate,
      endDate,
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
