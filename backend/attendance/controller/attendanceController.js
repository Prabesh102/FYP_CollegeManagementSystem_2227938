const Attendance = require("../model/attendanceModel");

const recordAttendance = async (req, res) => {
  try {
    const { section, attendance } = req.body;

    await Promise.all(
      attendance.map(async (record) => {
        const { studentName, present } = record;

        // Create a new Attendance record
        const attendanceRecord = new Attendance({
          section,
          studentName,
          present,
          timestamp: new Date(),
        });
        await attendanceRecord.save();
      })
    );

    res.status(201).json({ message: "Attendance recorded successfully" });
  } catch (error) {
    console.error("Error recording attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllAttendance = async (req, res) => {
  try {
    const attendanceDetails = await Attendance.find();
    res.status(200).json(attendanceDetails);
  } catch (error) {
    console.error("Error fetching attendance details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  recordAttendance,
  getAllAttendance,
};
