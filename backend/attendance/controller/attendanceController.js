const Attendance = require("../model/attendanceModel");

const recordAttendance = async (req, res) => {
  try {
    const { section, teacherName, attendance } = req.body;
    console.log(section, teacherName, attendance);
    await Promise.all(
      attendance.map(async (record) => {
        const { studentName, present } = record;

        // Create a new Attendance record including teacherName
        const attendanceRecord = new Attendance({
          section,
          teacherName,
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
const getAttendanceByTeacherName = async (req, res) => {
  try {
    const { teacherName } = req.query;

    const attendanceData = await Attendance.find({ teacherName });

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateAttendance = async (req, res) => {
  try {
    const { attendanceRecords } = req.body;

    await Promise.all(
      attendanceRecords.map(async (record) => {
        const { _id, present } = record;

        // Update the attendance record
        await Attendance.findByIdAndUpdate(_id, { present: present });
      })
    );

    res.status(200).json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAttendanceByTeacherNameDateAndSection = async (req, res) => {
  try {
    const { teacherName, date, section } = req.query;

    let query = { teacherName };
    if (date)
      query.timestamp = {
        $gte: new Date(date),
        $lt: new Date(date).setDate(new Date(date).getDate() + 1),
      };
    if (section) query.section = section;

    const attendanceData = await Attendance.find(query);

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  recordAttendance,
  getAllAttendance,
  getAttendanceByTeacherName,
  updateAttendance,
  getAttendanceByTeacherNameDateAndSection,
};
