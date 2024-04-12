import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Alert } from "react-bootstrap";
import moment from "moment-timezone";
import Navbar from "../admin/main/Navbar";
import "./teacher.css";

function Hello() {
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
  const [teacherName, setTeacherName] = useState([]);
  const [module, setModule] = useState([]);

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

  const handleView = (fileId) => {
    const file = files.find((file) => file._id === fileId);
    setAssignmentTitle(file.assignmentTitle);
    setTeacherName(file.teacherName);
    setModule(file.module);
    setAssignmentDescription(file.assignmentDescription);
    setStartDate(file.startDate);
    setEndDate(file.endDate);
    setSelectedSection(file.section);
    setSelectedCourse(file.course);
    setShowViewModal(true);
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
    <div>
      <Navbar />

      {/* View Assignment Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Assignment Title: {assignmentTitle}</h5>
          <p>Assignment posted by: {teacherName}</p>
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
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this assignment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {isPortalOpen && currentItems.length > 0 && (
        <div>
          <Table className="table" style={{ marginTop: "50px" }}>
            <thead>
              <tr>
                <th>Assignment posted by:</th>
                <th>Module name</th>
                <th>Assignment Title</th>
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
                  <td>{file.teacherName}</td>
                  <td>{file.module}</td>
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
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default Hello;
