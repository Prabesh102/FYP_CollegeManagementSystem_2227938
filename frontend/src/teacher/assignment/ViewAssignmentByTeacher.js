import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Alert } from "react-bootstrap";
import moment from "moment-timezone";
import Sidebar from "../Sidebar";
import "../teacher.css";

function ViewAssignmentByTeacher() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
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
  const [selectedFileId, setSelectedFileId] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const teacherName = localStorage.getItem("username");
  const module = localStorage.getItem("module");
  const [filterByTeacher, setFilterByTeacher] = useState(false);
  const [filterByModule, setFilterByModule] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/assignments/files?module=${module}`
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
  const handleShowByTeacherName = async () => {
    try {
      const username = localStorage.getItem("username");
      const response = await axios.get(
        `http://localhost:5000/api/assignments/files?teacherName=${username}`
      );
      setFiles(response.data);
      setFilterByTeacher(true);
      setFilterByModule(false); // Reset module filter
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowByModule = async () => {
    try {
      const module = localStorage.getItem("module");
      const response = await axios.get(
        `http://localhost:5000/api/assignments/files?module=${module}`
      );
      setFiles(response.data);
      setFilterByModule(true);
      setFilterByTeacher(false); // Reset teacher filter
    } catch (error) {
      console.error(error);
    }
  };

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
    const selectedDate = event.target.value;
    if (selectedDate < currentDate) {
      // If selected start date is earlier than current date, reset it to current date
      setStartDate(currentDate);
      setAlertType("warning");
      setAlertMessage("Start date cannot be earlier than today.");
    } else {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event) => {
    const selectedDate = event.target.value;
    if (selectedDate < currentDate) {
      // If selected end date is earlier than current date, reset it to current date
      setEndDate(currentDate);
      setAlertType("warning");
      setAlertMessage("End date cannot be earlier than today.");
    } else {
      setEndDate(selectedDate);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("assignmentTitle", assignmentTitle);
      formData.append("assignmentDescription", assignmentDescription);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("section", selectedSection);
      formData.append("course", selectedCourse);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await axios.put(
        `http://localhost:5000/api/assignments/updateFile/${selectedFileId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAlertType("success");
      setAlertMessage("Assignment updated successfully!");

      // Fetch updated files
      const response = await axios.get(
        "http://localhost:5000/api/assignments/files"
      );
      setFiles(response.data);
      setShowUpdateModal(false); // Close update modal after successful update
    } catch (error) {
      setAlertType("danger");
      setAlertMessage("Failed to update assignment.");
      console.error(error);
    }
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("module", module);
      formData.append("teacherName", teacherName); // Append teacherName to formData
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

  const handleView = (fileId) => {
    const file = files.find((file) => file._id === fileId);
    setAssignmentTitle(file.assignmentTitle);
    setAssignmentDescription(file.assignmentDescription);
    setStartDate(file.startDate);
    setEndDate(file.endDate);
    setSelectedSection(file.section);
    setSelectedCourse(file.course);
    setShowViewModal(true);
  };

  const handleUpdate = (fileId) => {
    const file = files.find((file) => file._id === fileId);
    setSelectedFileId(fileId);
    setAssignmentTitle(file.assignmentTitle);
    setAssignmentDescription(file.assignmentDescription);
    setStartDate(file.startDate);
    setEndDate(file.endDate);
    setSelectedSection(file.section);
    setSelectedCourse(file.course);
    setShowUpdateModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/assignments/deleteFile/${selectedFileId}`
      );
      const response = await axios.get(
        "http://localhost:5000/api/assignments/files"
      );
      setFiles(response.data);
      setShowDeleteModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = files.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ display: "flex", marginLeft: "12px" }}>
      <Sidebar />
      <div style={{ marginLeft: "50px" }}>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          style={{ marginTop: "50px", height: "50px" }}
        >
          Add Assignment
        </Button>

        {/* Add Assignment Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          {/* Modal Header */}
          <Modal.Header closeButton>
            <Modal.Title>Add Assignment</Modal.Title>
          </Modal.Header>
          {/* Modal Body */}
          <Modal.Body>
            {alertMessage && (
              <Alert
                variant={alertType}
                onClose={() => setAlertMessage("")}
                dismissible
              >
                {alertMessage}
              </Alert>
            )}

            <form>
              <label>
                Assignment Title:
                <input
                  type="text"
                  className="form-control custom-input"
                  value={assignmentTitle}
                  onChange={handleAssignmentTitleChange}
                  required
                />
              </label>
              <br />

              <label>
                Assignment Description:
                <input
                  type="text"
                  className="form-control custom-input"
                  value={assignmentDescription}
                  onChange={handleAssignmentDescriptionChange}
                  required
                />
              </label>
              <br />

              <label>
                Course:
                <select
                  className="form-control custom-input"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
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
              {/* Section */}
              <label>
                Section:
                <select
                  className="form-control custom-input"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  required
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
              {/* File input field */}
              <label>
                Assignment File:
                <input
                  type="file"
                  className="form-control custom-input"
                  onChange={handleFileChange}
                  required
                />
              </label>
              <br />
              {/* Start Date and Time */}
              <label>
                Start Date and Time:
                <input
                  className="form-control custom-input"
                  type="datetime-local"
                  value={startDate}
                  onChange={handleStartDateChange}
                  required
                />
              </label>
              <br />
              {/* End Date and Time */}
              <label>
                End Date and Time:
                <input
                  className="form-control custom-input"
                  type="datetime-local"
                  value={endDate}
                  onChange={handleEndDateChange}
                  required
                />
              </label>
            </form>
          </Modal.Body>
          {/* Modal Footer */}
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={startDate < currentDate || endDate < currentDate}
            >
              Upload
            </Button>
          </Modal.Footer>
        </Modal>

        {/* View Assignment Modal */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>View Assignment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Assignment Title: {assignmentTitle}</h5>
            <p>Uploaded by: {teacherName}</p>
            <p>Module name: {module}</p>
            <p>Assignment Description: {assignmentDescription}</p>
            <p>Start Date: {moment(startDate).format("YYYY-MM-DD HH:mm")}</p>
            <p>End Date: {moment(endDate).format("YYYY-MM-DD HH:mm")}</p>
            <p>Course: {selectedCourse}</p>
            <p>Section: {selectedSection}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Update Assignment Modal */}
        <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
          {/* Modal Header */}
          <Modal.Header closeButton>
            <Modal.Title>Update Assignment</Modal.Title>
          </Modal.Header>
          {/* Modal Body */}
          <Modal.Body>
            <form>
              {/* Assignment Title */}
              <label>
                Assignment Title:
                <input
                  type="text"
                  className="form-control"
                  value={assignmentTitle}
                  onChange={handleAssignmentTitleChange}
                  required
                />
              </label>
              <br />
              {/* Assignment Description */}
              <label>
                Assignment Description:
                <input
                  type="text"
                  className="form-control"
                  value={assignmentDescription}
                  onChange={handleAssignmentDescriptionChange}
                  required
                />
              </label>
              <br />
              {/* Course */}
              <label>
                Course:
                <select
                  className="form-control"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
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
              {/* Section */}
              <label>
                Section:
                <select
                  className="form-control"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  required
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
              {/* File input field */}
              <label>
                Assignment File:
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  required
                />
              </label>
              <br />
              {/* Start Date and Time */}
              <label>
                Start Date and Time:
                <input
                  className="form-control"
                  type="datetime-local"
                  value={startDate}
                  onChange={handleStartDateChange}
                  required
                />
              </label>
              <br />
              {/* End Date and Time */}
              <label>
                End Date and Time:
                <input
                  className="form-control"
                  type="datetime-local"
                  value={endDate}
                  onChange={handleEndDateChange}
                  required
                />
              </label>
            </form>
          </Modal.Body>
          {/* Modal Footer */}
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowUpdateModal(false)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdateSubmit}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Assignment Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this assignment?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
        <Button
          variant="success"
          onClick={handleShowByTeacherName}
          style={{
            marginTop: "50px",
            marginRight: "20px",
            marginLeft: "20px",
            height: "50px",
          }}
        >
          Show by my name
        </Button>
        <Button
          variant="info"
          onClick={handleShowByModule}
          style={{ marginTop: "50px", height: "50px" }}
        >
          Show all assessment of module
        </Button>
        {/* Pagination */}

        {/* Table */}
        {isPortalOpen && currentItems.length > 0 && (
          <div>
            <Table className="table" style={{ marginTop: "50px" }}>
              <thead>
                <tr>
                  <th>Assignment Title</th>
                  <th>Uploaded By: </th>
                  <th>Module Name</th>
                  <th>Assignment Description</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Uploaded Date</th>
                  <th>File</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((file) => (
                  <tr key={file._id}>
                    <td>{file.assignmentTitle}</td>
                    <td>{file.teacherName}</td>
                    <td>{file.module}</td>
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
                      {new Date(file.createdAt).toLocaleString("en-US", {
                        timeZone: "Asia/Kathmandu",
                      })}
                    </td>
                    <td>
                      <a
                        href={`http://localhost:5000/uploads/${file.filename}`}
                        download
                      >
                        Click here
                      </a>
                    </td>
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        textAlign: "center",
                        alignItems: "center",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={() => handleView(file._id)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="btn btn-warning me-2"
                        onClick={() => handleUpdate(file._id)}
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={() => {
                          setSelectedFileId(file._id);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        <ul className="pagination">
          {Array.from(
            { length: Math.ceil(files.length / itemsPerPage) },
            (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

export default ViewAssignmentByTeacher;
