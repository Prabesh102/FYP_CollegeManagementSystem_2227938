const express = require("express");
const reviewRouter = express.Router();
const {
  postSchedule,
  getSchedule,
  getScheduleForSection,
  createReview,
  getAllReviews,
} = require("../controller/reviewController");

// Define the route for creating a new schedule
reviewRouter.post("/", postSchedule);
reviewRouter.get("/", getSchedule);
reviewRouter.get("/review/section", getScheduleForSection);
reviewRouter.post("/store/review", createReview);
reviewRouter.get("/review/getall", getAllReviews);
module.exports = reviewRouter;
