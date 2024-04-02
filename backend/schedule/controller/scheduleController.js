const Schedule = require("../model/scheduleModel");
const asyncHandler = require("express-async-handler");

const getSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.find({});
  res.send(schedule).status(200);
});

const getScheduleSection = asyncHandler(async (req, res) => {
  const { sectionName } = req.params;
  const schedule = await Schedule.findOne({ section: sectionName });
  if (!schedule) {
    return res
      .status(404)
      .json({ message: "Schedule not found for this section" });
  }
  res.status(200).json(schedule);
});

const getSectionsByTeacher = asyncHandler(async (req, res) => {
  const { teacherUsername } = req.params;

  try {
    const schedules = await Schedule.find({
      "scheduleDetails.classrooms.teacher": teacherUsername,
    });

    const sections = schedules.map((schedule) => schedule.section);
    const uniqueSections = [...new Set(sections)]; // Remove duplicates
    res.status(200).json(uniqueSections);
  } catch (error) {
    console.error("Error fetching sections by teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const postSchedule = asyncHandler(async (req, res) => {
  const { section, scheduleDetails } = req.body;

  if (!section || !scheduleDetails || scheduleDetails.length === 0) {
    res.status(400).json({ message: "Please enter all details correctly" });
    return;
  }

  const schedule = await Schedule.create({
    section,
    scheduleDetails,
  });

  res.status(201).json(schedule);
});

const getScheduleById = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);
  if (!schedule) {
    res.send("Scheduled class not found").status(404);
  }
  res.send(schedule).status(200);
});

const updateSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!schedule) {
    res.send("Scheduled class not found").status(404);
  }
  res.send(schedule).status(200);
});

const deleteSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findByIdAndDelete(req.params.id);
  if (!schedule) {
    res.send("Scheduled class not found").status(404);
  }
  res.send(schedule).status(200);
});

const getCurrentDay = () => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[new Date().getDay()];
};

const getScheduleDetails = async (req, res) => {
  try {
    // Get current day in Kathmandu, Nepal timezone
    const kathmanduTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kathmandu",
    });
    const currentDay = new Date(kathmanduTime).toLocaleDateString("en-US", {
      weekday: "long",
    });

    // Get current time in Kathmandu, Nepal timezone
    const currentTime = new Date(kathmanduTime).toLocaleTimeString("en-US", {
      hour12: false,
    });

    // Get section and teacherName from query parameters
    const { section, teacherName } = req.query;

    // Find document based on the criteria
    const schedule = await Schedule.aggregate([
      {
        $match: {
          section: section,
          "scheduleDetails.scheduledDay": currentDay,
        },
      },
      {
        $unwind: "$scheduleDetails",
      },
      {
        $unwind: "$scheduleDetails.classrooms",
      },
      {
        $match: {
          "scheduleDetails.classrooms.teacher": teacherName,
          "scheduleDetails.classrooms.startTime": { $lte: currentTime },
          "scheduleDetails.classrooms.endTime": { $gte: currentTime },
        },
      },
      {
        $group: {
          _id: "$_id",
          section: { $first: "$section" },
          scheduleDetails: { $push: "$scheduleDetails" },
          __v: { $first: "$__v" },
        },
      },
    ]);

    if (schedule.length === 0) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Returning the first matching schedule
    res.json(schedule[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getSchedule,
  getScheduleById,
  postSchedule,
  updateSchedule,
  deleteSchedule,
  getSectionsByTeacher,
  getScheduleSection,
  getScheduleDetails,
};
