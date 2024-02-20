const Book = require("../model/bookModel");
const cloudinary = require("cloudinary");
const multer = require("multer");
const asyncHandler = require("express-async-handler");
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload = multer({ storage: storage });

const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({});
  res.send(books).status(200);
});
const getBooksById = asyncHandler(async (req, res) => {
  const books = await Book.findById(req.params.id);
  if (!books) {
    res.json({ message: "Id not found" });
    res.status(404);
  }
  res.send(books).status(200);
});
const postBooks = asyncHandler(async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("Image upload failed:", err);
      res.status(400).json({ message: "Image upload failed" });
      return;
    }

    const { bookName, bookCategory, bookPrice, totalPages, selfNo } = req.body;
    if (!bookName || !bookCategory || !bookPrice || !totalPages) {
      res.json({ message: "Please enter all the  data correctly" });
      res.status(404);
    }
    const image = await cloudinary.uploader.upload(req.file.path);

    const books = await Book.create({
      image: image.secure_url,
      bookName,
      bookCategory,
      bookPrice,
      totalPages,
      selfNo,
    });
    res.send(books).status(200);
  });
});
const updateBooks = asyncHandler(async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("Image upload failed:", err);
      res.status(400).json({ message: "Image upload failed" });
      return;
    }

    try {
      if (req.file) {
        const image = await cloudinary.uploader.upload(req.file.path);
        req.body.image = image.secure_url;
      }
      const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      if (!updatedBook) {
        res.status(404).json({ message: "Book not found" });
        return;
      }

      res.status(200).json(updatedBook);
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
});

const deleteBooks = asyncHandler(async (req, res) => {
  const books = await Book.findByIdAndDelete(req.params.id);
  if (!books) {
    res.send("Books not found");
    res.status(404);
  }
  res.send(books).status(200);
});
module.exports = {
  getBooks,
  getBooksById,
  postBooks,
  updateBooks,
  deleteBooks,
};
