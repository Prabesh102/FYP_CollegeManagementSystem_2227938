const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const dbConnect = () => {
  const connect = mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  if (connect) {
    console.log("Database connected successfully");
  }
};
module.exports = dbConnect;
