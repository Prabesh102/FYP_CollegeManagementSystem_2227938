import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./admin.css";
ChartJS.register(ArcElement, Tooltip, Legend);
const LineChartComponent = () => {
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
    labels: ["Student", "Teacher", "Section", "Class"],
    datasets: [
      {
        data: [userCounts.studentCount, userCounts.teacherCount, 20, 10],
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

  return (
    <div className="main-chart">
      {/* <p className="heading-student">Student's Details</p> */}
      <Pie data={data} />
    </div>
  );
};

export default LineChartComponent;
