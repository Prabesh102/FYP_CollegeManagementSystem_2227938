const express = require("express");
const SectionRouter = express.Router();
const {
  getSection,
  getSectionById,
  postSection,
  updateSection,
  deleteSection,
} = require("../controller/sectionController");
SectionRouter.get("/getAllSection", getSection);
SectionRouter.get("/getSectionById/:id", getSectionById);
SectionRouter.post("/postSection", postSection);
SectionRouter.put("/updateSection/:id", updateSection);
SectionRouter.delete("/deleteSection/:id", deleteSection);
module.exports = SectionRouter;
