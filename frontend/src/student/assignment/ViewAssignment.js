import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import { Modal, Button, Table } from "react-bootstrap";
import moment from "moment-timezone";

const ViewAssignment = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's section and course information from local storage
        const userSection = localStorage.getItem("section");
        const userCourse = localStorage.getItem("course");

        const response = await axios.get(
          "http://localhost:5000/api/assignments/files"
        );
        const assignments = response.data;

        // Filter assignments based on user's section and course
        const visibleAssignments = assignments.filter(
          (assignment) =>
            assignment.section === userSection &&
            assignment.course === userCourse
        );

        const currentDate = moment().tz("Asia/Kathmandu");
        const filteredAssignments = visibleAssignments.filter((assignment) =>
          currentDate.isBetween(
            moment.tz(assignment.startDate, "Asia/Kathmandu"),
            moment.tz(assignment.endDate, "Asia/Kathmandu")
          )
        );

        setFiles(filteredAssignments);
        setIsPortalOpen(filteredAssignments.length > 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-md-9 d-flex">
      <div style={{ display: "flex", marginLeft: "12px" }}>
        <Sidebar />
        <div>
          {isPortalOpen && files.length > 0 && (
            <div>
              <Table
                striped
                bordered
                hover
                style={{ marginTop: "50px", marginLeft: "15px" }}
              >
                <thead>
                  <tr>
                    <th>Assignment Title</th>
                    <th>Assignment Description</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>File</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file._id}>
                      <td>{file.assignmentTitle}</td>
                      <td>{file.assignmentDescription}</td>
                      <td>
                        {new Date(file.startDate).toLocaleString("en-US", {
                          timeZone: "Asia/Kathmandu",
                        })}
                      </td>
                      <td>
                        {new Date(file.endDate).toLocaleString("en-US", {
                          timeZone: "Asia/Kathmandu",
                        })}
                      </td>
                      <td>
                        <a
                          href={`http://localhost:5000/uploads/${file.filename}`}
                          download
                        >
                          {file.filename}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAssignment;
