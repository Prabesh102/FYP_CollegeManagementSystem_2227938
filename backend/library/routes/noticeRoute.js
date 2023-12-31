const express = require("express");
const noticeRouter = express.Router();
const {
  getNotice,
  getNoticeById,
  postNotice,
  updateNotice,
  deleteNotice,
} = require("../controller/noticeController");
noticeRouter.get("/", getNotice);
noticeRouter.get("/:id", getNoticeById);
noticeRouter.post("/", postNotice);
noticeRouter.put("/:id", updateNotice);
noticeRouter.delete("/:id", deleteNotice);
module.exports = noticeRouter;
