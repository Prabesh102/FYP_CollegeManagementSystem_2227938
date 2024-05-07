const { Review } = require("../modal/reviewModal");
const asyncHandler = require("express-async-handler");
const User = require("../../login/model/userModel");
const Reviewstore = require("../modal/reviewStoreModal");
// Handler to create a new schedule entry
const postSchedule = asyncHandler(async (req, res) => {
  const { section, startDateTime, endDateTime } = req.body;

  // Validate the incoming data
  if (!section || !startDateTime || !endDateTime) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    // Create a new schedule document
    const schedule = await Review.create({
      section,
      startDateTime,
      endDateTime,
    });

    // Return the created schedule
    res.status(201).json(schedule);
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
const getSchedule = asyncHandler(async (req, res) => {
  const schedule = await Review.find({});
  res.send(schedule).status(200);
});
const getScheduleForSection = asyncHandler(async (req, res) => {
  const storedSection = req.query.section;

  try {
    // Find all teachers associated with the section
    const teachers = await User.find({
      sections: storedSection,
      role: "teacher",
    });

    const schedules = await Review.find({ section: storedSection });

    const activeSchedules = schedules.filter((schedule) => {
      const currentDateTime = new Date();
      return (
        currentDateTime >= schedule.startDateTime &&
        currentDateTime <= schedule.endDateTime
      );
    });

    res.status(200).json({ activeSchedules, teachers });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
const createReview = asyncHandler(async (req, res) => {
  const { studentName, sectionName, reviews } = req.body;

  try {
    const newReview = await Reviewstore.create({
      studentName,
      sectionName,
      reviews,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getAllReviews = asyncHandler(async (req, res) => {
  try {
    const reviews = await Reviewstore.find({});
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  postSchedule,
  getSchedule,
  getScheduleForSection,
  createReview,
  getAllReviews,
};
