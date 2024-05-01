import React, { useState, useEffect } from "react";
import axios from "axios"; // Assuming you're using axios for HTTP requests

const StudentResult = () => {
  const [studentResult, setStudentResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch student name from localStorage
    const studentName = localStorage.getItem("username");

    // Fetch result for the logged-in student
    const fetchStudentResult = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/resultMaker?studentName=${studentName}`
        );
        setStudentResult(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student result:", error);
        setLoading(false);
      }
    };

    if (studentName) {
      fetchStudentResult();
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Student Result</h1>
      {studentResult ? (
        <div>
          <p>Student Name: {studentResult.studentName}</p>
          <p>Module Name: {studentResult.moduleName}</p>
          <p>Total Mark: {studentResult.totalMark}</p>
          <p>Obtained Mark: {studentResult.obtainedMark}</p>
        </div>
      ) : (
        <p>No result found for the student</p>
      )}
    </div>
  );
};

export default StudentResult;
