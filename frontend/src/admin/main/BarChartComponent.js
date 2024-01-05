import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import ChartJS from "chart.js/auto"; // Updated import
import "./admin.css";

const BarChartComponent = () => {
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
    // Log userCounts for debugging
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
        label: "Student",
        data: [userCounts.studentCount, userCounts.teacherCount, 20, 5],
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
      {/* <p className="heading-student">Student's Details</p> */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChartComponent;
