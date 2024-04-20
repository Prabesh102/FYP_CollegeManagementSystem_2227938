import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";

const AttendancePieChart = ({ presentCount, absentCount }) => {
  const data = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [presentCount, absentCount],
        backgroundColor: ["#36a2eb", "#ff6384"],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
};

export default AttendancePieChart;
