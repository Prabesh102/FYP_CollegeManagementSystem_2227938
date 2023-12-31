import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminCss.css";
const AddBooks = () => {
  const [formData, setFormData] = useState({
    bookName: "",
    bookCategory: "",
    bookPrice: "",
    totalPages: "",
    selfNo: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("bookName", formData.bookName);
    formDataToSend.append("bookCategory", formData.bookCategory);
    formDataToSend.append("bookPrice", formData.bookPrice);
    formDataToSend.append("totalPages", formData.totalPages);
    formDataToSend.append("selfNo", formData.selfNo);
    formDataToSend.append("image", formData.image);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/library/books",
        formDataToSend
      );
      console.log("Book created:", response.data);

      setFormData({
        bookName: "",
        bookCategory: "",
        bookPrice: "",
        totalPages: "",
        selfNo: "",
        image: null,
      });
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Book Name</label>
        <input
          type="text"
          name="bookName"
          value={formData.bookName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Book Category</label>
        <input
          type="text"
          name="bookCategory"
          value={formData.bookCategory}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Book Price</label>
        <input
          type="number"
          name="bookPrice"
          value={formData.bookPrice}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Total Pages</label>
        <input
          type="number"
          name="totalPages"
          value={formData.totalPages}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Shelf Number</label>
        <input
          type="text"
          name="selfNo"
          value={formData.selfNo}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Create Book</button>
    </form>
  );
};
export default AddBooks;
