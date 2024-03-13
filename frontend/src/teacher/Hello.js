import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table } from "react-bootstrap";
import moment from "moment-timezone";
import Navbar from "../admin/main/Navbar";

function Hello() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [files, setFiles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/assignments/files"
        );
        const assignments = response.data;

        // Remove the date filter, display all assignments
        setFiles(assignments);

        // Check if there are assignments, and set isPortalOpen to true
        setIsPortalOpen(assignments.length > 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAssignmentTitleChange = (event) => {
    setAssignmentTitle(event.target.value);
  };

  const handleAssignmentDescriptionChange = (event) => {
    setAssignmentDescription(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("assignmentTitle", assignmentTitle);
      formData.append("assignmentDescription", assignmentDescription);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);

      await axios.post(
        "http://localhost:5000/api/assignments/upload",
        formData
      );

      if (isPortalOpen) {
        const response = await axios.get(
          "http://localhost:5000/api/assignments/files"
        );
        setFiles(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <Button
        variant="primary"
        onClick={() => setShowAddModal(true)}
        style={{ marginTop: "100px", marginLeft: "15px" }}
      >
        Add Assignment
      </Button>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <label>
              Assignment Title:
              <input
                type="text"
                value={assignmentTitle}
                onChange={handleAssignmentTitleChange}
              />
            </label>
            <br />
            <label>
              Assignment Description:
              <input
                type="text"
                value={assignmentDescription}
                onChange={handleAssignmentDescriptionChange}
              />
            </label>
            <br />
            <label>
              Assignment File:
              <input type="file" onChange={handleFileChange} />
            </label>
            <br />
            <label>
              Start Date and Time:
              <input
                type="datetime-local"
                value={startDate}
                onChange={handleStartDateChange}
              />
            </label>
            <br />
            <label>
              End Date and Time:
              <input
                type="datetime-local"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </label>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>

      {isPortalOpen && files.length > 0 && (
        <div>
          <Table striped bordered hover style={{ marginTop: "50px" }}>
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
  );
}

export default Hello;
