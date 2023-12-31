import React, { useEffect, useState } from "react";
import axios from "axios";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    level: "",
    group: "",
    bookTaken: "",
    timeDuration: "",
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
        "http://localhost:5000/api/library/students",
        formData
      );
      console.log("Student added:", response.data);
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Student name</label>
        <input
          type="text"
          name="studentName"
          value={formData.studentName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Student level</label>
        <input
          type="text"
          name="level"
          value={formData.level}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Group</label>
        <input
          type="text"
          name="group"
          value={formData.group}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Book taken</label>
        <input
          type="text"
          name="bookTaken"
          value={formData.bookTaken}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Time duration</label>
        <input
          type="text"
          name="timeDuration"
          value={formData.timeDuration}
          onChange={handleInputChange}
        />
      </div>

      <button type="submit">Add student</button>
    </form>
  );
};

export default AddStudent;
