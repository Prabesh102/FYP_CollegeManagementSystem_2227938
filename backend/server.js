// Import the required modules
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const dbConnect = require("./database/dbConnect");
const bookRouter = require("./library/routes/bookRoute");
const studentRouter = require("./library/routes/studentRoute");
const noticeRouter = require("./library/routes/noticeRoute");
const foodRouter = require("./canteen/routes/foodRoute");
const userRoute = require("./login/routes/userRoute");
const courseRouter = require("./courses/routes/courseRoute");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const SectionRouter = require("./sections/routes/sectionRoute");
const classroomRouter = require("./classroom/route/classroomRoute");
const scheduleRouter = require("./schedule/route/scheduleRoute");
const path = require("path");

const assignmentRoute = require("./assignment/route/assignmentRoute");
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.json());
cloudinary.config({
  cloud_name: "dsnmhnj0b",
  api_key: "812327346814326",
  api_secret: "35duA2Z6IV4sNVzcOIsZVsrffrQ",
});

// Define CORS options
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  credentials: true, // Enable sending cookies from the frontend
};

app.use(cors(corsOptions));

// Add routes
app.use("/api/canteen/foods", foodRouter);
app.use("/api/library/books", bookRouter);
app.use("/api/library/students", studentRouter);
app.use("/api/library/notice", noticeRouter);
app.use("/api/users", userRoute);
app.use("/api/courses", courseRouter);
app.use("/api/section", SectionRouter);
app.use("/api/classroom", classroomRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/uploads", express.static("uploads"));

app.use("/api/assignments", assignmentRoute);

const PORT = 5000;

dbConnect();
app.timeout = 60000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
