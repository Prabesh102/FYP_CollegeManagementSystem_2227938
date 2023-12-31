const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const dbConnect = require("./database/dbConnect");
const bookRouter = require("./library/routes/bookRoute");
const studentRouter = require("./library/routes/studentRoute");
const noticeRouter = require("./library/routes/noticeRoute");
const foodRouter = require("./canteen/routes/foodRoute");
const userRoute = require("./login/routes/userRoute");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

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
app.use("/uploads", express.static("uploads"));

const PORT = 5000;

dbConnect();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
