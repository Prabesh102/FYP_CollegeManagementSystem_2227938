import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import ChartJS from "chart.js/auto"; // Updated import
import "./admin.css";

const BarChartComponent = () => {
  const [sectionCount, setSectionCount] = useState(0);
  const [classroomCount, setClassroomCount] = useState(0);
  const [userCounts, setUserCounts] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/userCountsByRole"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUserCounts(data);
      } catch (error) {
        setError(error); // Set error state if API call fails
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/classroom/countClassroom"
        );
        const data = await response.json();
        setClassroomCount(data.classroomCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/section/getSectionCount"
        );
        const data = await response.json();
        setSectionCount(data.sectionCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("userCounts:", userCounts);
  }, [userCounts]);

  if (Object.keys(userCounts).length === 0) {
    return <div>No data available</div>;
  }
  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const data = {
    labels: ["Student", "Teacher", "Classes", "Sections"],
    datasets: [
      {
        label: "Counts",
        data: [
          userCounts.studentCount,
          userCounts.teacherCount,
          classroomCount,
          sectionCount,
        ],
        backgroundColor: [
          "rgba(64,219,188,255)",
          "rgba(255,189,95,255)",
          "rgba(86,165,255,255)",
          "rgba(255,102,128,255)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const chartContainerStyle = {
    width: "600px",
    height: "335px",
  };

  return (
    <div className="main-chart " style={chartContainerStyle}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChartComponent;
