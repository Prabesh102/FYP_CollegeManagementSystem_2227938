const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

module.exports = dbConnect;
