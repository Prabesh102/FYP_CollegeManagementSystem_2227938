import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Alert } from "react-bootstrap";
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
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/assignments/files"
        );
        const assignments = response.data;
        setFiles(assignments);
        setIsPortalOpen(assignments.length > 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/section/getAllSection"
        );
        if (response.ok) {
          const data = await response.json();
          setSections(data);
        } else {
          throw new Error("Failed to fetch sections");
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchSections();
  }, []);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/courses/getAllCourse"
        );
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          throw new Error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
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
      formData.append("section", selectedSection);
      formData.append("course", selectedCourse);

      await axios.post(
        "http://localhost:5000/api/assignments/upload",
        formData
      );
      setAlertType("success");
      setAlertMessage("Assignment uploaded successfully!");
      const response = await axios.get(
        "http://localhost:5000/api/assignments/files"
      );
      setFiles(response.data);
    } catch (error) {
      setAlertType("danger");
      setAlertMessage("Failed to upload assignment.");
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
          {alertMessage && ( // Display alert if alertMessage is not empty
            <Alert
              variant={alertType}
              onClose={() => setAlertMessage("")}
              dismissible
            >
              {alertMessage}
            </Alert>
          )}

          {isPortalOpen && files.length > 0 && (
            <div>
              <Table striped bordered hover style={{ marginTop: "50px" }}>
                {/* Table content remains the same */}
              </Table>
            </div>
          )}
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
              Course:
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course.courseName}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Section:
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section._id} value={section.sectionName}>
                    {section.sectionName}
                  </option>
                ))}
              </select>
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
