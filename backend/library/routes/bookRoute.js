const express = require("express");
const bookRouter = express.Router();
const {
  getBooks,
  getBooksById,
  postBooks,
  updateBooks,
  deleteBooks,
} = require("../controller/bookController");
bookRouter.get("/", getBooks);
bookRouter.get("/:id", getBooksById);
bookRouter.post("/", postBooks);
bookRouter.put("/:id", updateBooks);
bookRouter.delete("/:id", deleteBooks);
module.exports = bookRouter;
