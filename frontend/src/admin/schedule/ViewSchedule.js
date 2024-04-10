// ViewSchedule.js
import React, { useState, useEffect } from "react";
import Navbar from "../main/Navbar";
import "../main/admin.css";
import axios from "axios";

const ViewSchedule = () => {
  const [sectionOptions, setSectionOptions] = useState([]);
  const [classroomOptions, setClassroomOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]); // Add teacher options state
  const [formData, setFormData] = useState({
    section: "",
    scheduleDetails: [
      {
        scheduledDay: "",
        numberOfClass: 0,
        classrooms: [
          {
            classroom: "",
            time: "",
            teacher: "", // Add teacher field
          },
        ],
      },
    ],
  });

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/section/getAllSection"
        );
        setSectionOptions(response.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    const fetchClassrooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/classroom");
        const classroomNames = response.data.map(
          (classroom) => classroom.className
        );
        setClassroomOptions(classroomNames);
      } catch (error) {
        console.error("Error fetching classrooms:", error);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/getAllTeachers"
        );
        const teacherNames = response.data.map((teacher) => teacher.username);
        setTeacherOptions(teacherNames);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchSections();
    fetchClassrooms();
    fetchTeachers(); // Call fetchTeachers
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDetailsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDetails = [...formData.scheduleDetails];
    updatedDetails[index][name] = value;
    setFormData({
      ...formData,
      scheduleDetails: updatedDetails,
    });
  };
  const handleTimeChange = (classIndex, e) => {
    const { value } = e.target;
    const updatedClassrooms = [...formData.scheduleDetails[0].classrooms];
    updatedClassrooms[classIndex] = {
      ...updatedClassrooms[classIndex],
      time: value,
    };
    setFormData({
      ...formData,
      scheduleDetails: [
        {
          ...formData.scheduleDetails[0],
          classrooms: updatedClassrooms,
        },
      ],
    });
  };

  const handleClassroomChange = (classIndex, e) => {
    const { name, value } = e.target;
    const updatedClassrooms = [...formData.scheduleDetails[0].classrooms];
    updatedClassrooms[classIndex] = {
      ...updatedClassrooms[classIndex],
      [name]: value,
    };
    setFormData({
      ...formData,
      scheduleDetails: [
        {
          ...formData.scheduleDetails[0],
          classrooms: updatedClassrooms,
        },
      ],
    });
  };

  const handleTeacherChange = (classIndex, e) => {
    // Handle teacher change
    const { value } = e.target;
    const updatedClassrooms = [...formData.scheduleDetails[0].classrooms];
    updatedClassrooms[classIndex] = {
      ...updatedClassrooms[classIndex],
      teacher: value,
    };
    setFormData({
      ...formData,
      scheduleDetails: [
        {
          ...formData.scheduleDetails[0],
          classrooms: updatedClassrooms,
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/schedule/",
        formData
      );
      console.log("Schedule created successfully:", response.data);
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };
  const handleStartTimeChange = (classIndex, e) => {
    const { value } = e.target;
    const updatedClassrooms = [...formData.scheduleDetails[0].classrooms];
    updatedClassrooms[classIndex] = {
      ...updatedClassrooms[classIndex],
      startTime: value,
    };
    setFormData({
      ...formData,
      scheduleDetails: [
        {
          ...formData.scheduleDetails[0],
          classrooms: updatedClassrooms,
        },
      ],
    });
  };

  const handleEndTimeChange = (classIndex, e) => {
    const { value } = e.target;
    const updatedClassrooms = [...formData.scheduleDetails[0].classrooms];
    updatedClassrooms[classIndex] = {
      ...updatedClassrooms[classIndex],
      endTime: value,
    };
    setFormData({
      ...formData,
      scheduleDetails: [
        {
          ...formData.scheduleDetails[0],
          classrooms: updatedClassrooms,
        },
      ],
    });
  };
  const handleClassTypeChange = (classIndex, e) => {
    const { value } = e.target;
    const updatedClassrooms = [...formData.scheduleDetails[0].classrooms];
    updatedClassrooms[classIndex] = {
      ...updatedClassrooms[classIndex],
      classType: value,
    };
    setFormData({
      ...formData,
      scheduleDetails: [
        {
          ...formData.scheduleDetails[0],
          classrooms: updatedClassrooms,
        },
      ],
    });
  };

  const renderClassroomFields = () => {
    const { numberOfClass, classrooms: classroomList } =
      formData.scheduleDetails[0];
    const classroomFields = [];

    if (numberOfClass !== 0) {
      for (let i = 0; i < numberOfClass; i++) {
        classroomFields.push(
          <div key={i} className="form-row" style={{ display: "flex" }}>
            <div className="form-group col">
              <label htmlFor={`classroom${i}`}>Classroom:</label>
              <select
                id={`classroom${i}`}
                name="classroom"
                className="form-control"
                value={classroomList[i]?.classroom || ""}
                onChange={(e) => handleClassroomChange(i, e)}
                required
              >
                <option value="">Select a classroom</option>
                {classroomOptions.map((classroom, index) => (
                  <option key={index} value={classroom}>
                    {classroom}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col">
              <label htmlFor={`classType${i}`}>Class Type:</label>
              <select
                id={`classType${i}`}
                name={`classType${i}`}
                className="form-control"
                value={classroomList[i]?.classType || ""}
                onChange={(e) => handleClassTypeChange(i, e)}
                required
              >
                <option value="">Select a class type</option>
                <option value="tutorial">Tutorial</option>
                <option value="workshop">Workshop</option>
                <option value="lecture">Lecture</option>
              </select>
            </div>
            <div className="form-group col">
              <label htmlFor={`teacher${i}`}>Teacher:</label>
              <select
                id={`teacher${i}`}
                name={`teacher${i}`}
                className="form-control"
                value={classroomList[i]?.teacher || ""}
                onChange={(e) => handleTeacherChange(i, e)}
                required
              >
                <option value="">Select a teacher</option>
                {teacherOptions.map((teacher, index) => (
                  <option key={index} value={teacher}>
                    {teacher}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col">
              <label htmlFor={`startTime${i}`}>Start Time:</label>
              <input
                type="time"
                id={`startTime${i}`}
                name={`startTime${i}`}
                className="form-control"
                value={classroomList[i]?.startTime || ""}
                onChange={(e) => handleStartTimeChange(i, e)}
                required
              />
            </div>
            <div className="form-group col">
              <label htmlFor={`endTime${i}`}>End Time:</label>
              <input
                type="time"
                id={`endTime${i}`}
                name={`endTime${i}`}
                className="form-control"
                value={classroomList[i]?.endTime || ""}
                onChange={(e) => handleEndTimeChange(i, e)}
                required
              />
            </div>
          </div>
        );
      }
    }
    return classroomFields;
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Schedule Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="section">Section:</label>
            <select
              id="section"
              name="section"
              className="form-control"
              value={formData.section}
              onChange={handleChange}
              required
            >
              <option value="">Select a section</option>
              {sectionOptions.map((section) => (
                <option key={section._id} value={section.sectionName}>
                  {section.sectionName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="scheduledDay">Scheduled Day:</label>
            <select
              id="scheduledDay"
              name="scheduledDay"
              className="form-control"
              value={formData.scheduleDetails[0].scheduledDay}
              onChange={(e) => handleDetailsChange(0, e)}
              required
            >
              <option value="">Select a day</option>
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="numberOfClass">Number of Classes:</label>
            <select
              id="numberOfClass"
              name="numberOfClass"
              className="form-control"
              value={formData.scheduleDetails[0].numberOfClass}
              onChange={(e) => handleDetailsChange(0, e)}
              required
            >
              <option value="">Select number of classes</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          {renderClassroomFields()}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default ViewSchedule;
