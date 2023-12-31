const Notice = require("../model/noticeModel");
const asyncHandler = require("express-async-handler");
const getNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.find({});
  res.send(notice).status(200);
});
const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    res.json({ message: "Id not found" });
    res.status(404);
  }
  res.send(notice).status(200);
});
const postNotice = asyncHandler(async (req, res) => {
  const { noticeTitle, noticeDescription } = req.body;
  if (!noticeTitle || !noticeDescription) {
    res.json({ message: "Please enter all the  data correctly" });
    res.status(404);
  }
  const notice = await Notice.create({
    noticeTitle,
    noticeDescription,
  });
  res.send(notice).status(200);
});
const updateNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!notice) {
    res.send("Notice not found");
    res.status(404);
  }
  res.send(notice).status(200);
});
const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) {
    res.send("notice not found");
    res.status(404);
  }
  res.send(notice).status(200);
});
module.exports = {
  getNotice,
  getNoticeById,
  postNotice,
  updateNotice,
  deleteNotice,
};
