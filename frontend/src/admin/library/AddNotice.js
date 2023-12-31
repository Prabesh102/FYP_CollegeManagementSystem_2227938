import React, { useEffect, useState } from "react";
import axios from "axios";
import "./adminCss.css";
const AddNotice = () => {
  const [formData, setFormData] = useState({
    noticeTitle: "",
    noticeDescription: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/library/notice",
        formData
      );
      console.log("Notice added : ", response.data);
    } catch (error) {
      console.log("error occured while adding notice", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="noticeTitle"
        value={formData.noticeTitle}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="noticeDescription"
        value={formData.noticeDescription}
        onChange={handleInputChange}
      />
      <button type="submit">Add notice</button>
    </form>
  );
};

export default AddNotice;
