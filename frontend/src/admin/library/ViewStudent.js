import React, { useEffect, useState } from "react";
import axios from "axios";
import "./adminCss.css";
const ViewStudent = () => {
  const [students, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/library/students")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  return (
    <div>
      <h1>Books</h1>
      <table>
        <th>Student Name</th>
        <th>Level</th>
        <th>Group</th>
        <th>Book taken</th>
        <th>Time Duration</th>
        {students.map((student) => (
          <tr key={student._id}>
            <td>{student.studentName}</td>
            <td> {student.level}</td>
            <td>{student.group}</td>
            <td>{student.bookTaken}</td>
            <td>{student.timeDuration}</td>
            <td>
              <button>View</button>
              <button>Update</button>
              <button>Delete</button>
            </td>
          </tr>
        ))}{" "}
      </table>

      <a href="/admin/addStudent">
        <button>Add new student</button>
      </a>
    </div>
  );
};

export default ViewStudent;
