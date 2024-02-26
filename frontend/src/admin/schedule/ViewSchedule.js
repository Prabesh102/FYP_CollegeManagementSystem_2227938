import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewSchedule = () => {
  const [scheduleData, setScheduleData] = useState({
    section: "",
    days: [
      { day: "Sunday", numberOfClass: 0, scheduleDetails: [] },
      { day: "Monday", numberOfClass: 0, scheduleDetails: [] },
      { day: "Tuesday", numberOfClass: 0, scheduleDetails: [] },
      { day: "Wednesday", numberOfClass: 0, scheduleDetails: [] },
      { day: "Thursday", numberOfClass: 0, scheduleDetails: [] },
      { day: "Friday", numberOfClass: 0, scheduleDetails: [] },
    ],
  });

  const [sections, setSections] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    // Fetch sections and classrooms data
    axios
      .get("http://localhost:5000/api/section/getAllSection")
      .then((response) => {
        const sectionData = response.data.map((section) => ({
          id: section._id,
          name: section.sectionName,
        }));
        setSections(sectionData);
      })
      .catch((error) => {
        console.error("Error fetching sections:", error);
      });

    axios
      .get("http://localhost:5000/api/classroom/")
      .then((response) => {
        const classroomData = response.data.map((classroom) => ({
          id: classroom._id,
          name: classroom.className,
        }));
        setClassrooms(classroomData);
      })
      .catch((error) => {
        console.error("Error fetching classrooms:", error);
      });
  }, []);

  const handleChange = (e, dayIndex, detailIndex) => {
    const { name, value } = e.target;

    setScheduleData((prevData) => {
      const updatedDays = [...prevData.days];

      if (name === "numberOfClass") {
        updatedDays[dayIndex].numberOfClass = parseInt(value, 10);
        updatedDays[dayIndex].scheduleDetails = Array.from(
          { length: parseInt(value, 10) },
          () => ({ classroom: "", time: "" })
        );
      } else if (name.includes("classroom") || name.includes("time")) {
        updatedDays[dayIndex].scheduleDetails[detailIndex][name] = value;
      } else {
        updatedDays[dayIndex][name] = value;
      }

      return {
        ...prevData,
        days: updatedDays,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting scheduleData:", scheduleData);
    axios
      .post("http://localhost:5000/api/schedule/", scheduleData)
      .then((response) => {
        console.log(response.data);
        // Handle success or redirect
      })
      .catch((error) => {
        console.error("Error adding schedule:", error);
        // Handle error
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Section:</label>
        <select
          name="section"
          value={scheduleData.section}
          onChange={(e) =>
            setScheduleData({ ...scheduleData, section: e.target.value })
          }
        >
          <option key="default" value="">
            Select Section
          </option>
          {sections.map((section) => (
            <option key={section.id} value={section.name}>
              {section.name}
            </option>
          ))}
        </select>
      </div>

      {scheduleData.days.map((day, dayIndex) => (
        <div key={`day_${dayIndex}`}>
          <label>{`Day ${dayIndex + 1} (${day.day}):`}</label>

          <div>
            <label>No of classes:</label>
            <input
              type="number"
              name={`numberOfClass_${dayIndex}`}
              value={day.numberOfClass}
              onChange={(e) => handleChange(e, dayIndex)}
              min="1"
              max="5"
            />
          </div>

          {day.scheduleDetails.map((detail, detailIndex) => (
            <div key={`scheduleDetail_${detailIndex}`}>
              <label>{`Classroom ${detailIndex + 1}:`}</label>
              <select
                name={`classroom_${dayIndex}_${detailIndex}`}
                value={detail.classroom}
                onChange={(e) => handleChange(e, dayIndex, detailIndex)}
              >
                <option key={`default_${detailIndex}`} value="">
                  Select Classroom
                </option>
                {classrooms.map((classroomOption) => (
                  <option key={classroomOption.id} value={classroomOption.name}>
                    {classroomOption.name}
                  </option>
                ))}
              </select>

              <label>{`Time ${detailIndex + 1}:`}</label>
              <input
                type="text"
                name={`time_${dayIndex}_${detailIndex}`}
                value={detail.time}
                onChange={(e) => handleChange(e, dayIndex, detailIndex)}
              />
            </div>
          ))}
        </div>
      ))}

      <button type="submit">Add Schedule</button>
    </form>
  );
};

export default ViewSchedule;
