const Section = require("../model/sectionModel");
const mongoose = require("mongoose");

const asyncHandler = require("express-async-handler");
const getSection = asyncHandler(async (req, res) => {
  const section = await Section.find({});
  res.send(section).status(200);
});

const getSectionById = asyncHandler(async (req, res) => {
  const section = await Section.findById(req.params.id);
  if (!section) {
    res.send("Section not found");
  }
  res.send(section).status(200);
});

const postSection = asyncHandler(async (req, res) => {
  const { sectionName, totalStudents } = req.body;
  if (!sectionName || !totalStudents) {
    res.send("Please enter all the fields");
  }
  const section = await Section.create({
    sectionName,
    totalStudents,
  });
  res.send(section).status(201);
});
const updateSection = asyncHandler(async (req, res) => {
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);

  if (!isValidId) {
    return res.status(400).send("Invalid section ID");
  }

  const section = await Section.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!section) {
    return res.status(404).send("Section not found");
  }

  res.send(section).status(200);
});
const deleteSection = asyncHandler(async (req, res) => {
  const section = await Section.findByIdAndDelete(req.params.id);
  if (!section) {
    res.send("Section not found").status(400);
  }
  res.send(section).status(200);
});
module.exports = {
  getSection,
  getSectionById,
  postSection,
  updateSection,
  deleteSection,
};
