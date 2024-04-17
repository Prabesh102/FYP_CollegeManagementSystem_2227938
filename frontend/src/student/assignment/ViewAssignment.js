import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import { Modal, Button, Table, Form } from "react-bootstrap";
import moment from "moment-timezone";

const ViewAssignment = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [formData, setFormData] = useState({
    file: null,
    remarks: "",
  });
  const [showModal, setShowModal] = useState(false);
  const username = localStorage.getItem("username");
  const studentSection = JSON.parse(localStorage.getItem("sections"));
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's sections and course information from local storage

        const userSectionsString = localStorage.getItem("sections");
        const userSections = JSON.parse(userSectionsString);

        const userCourse = localStorage.getItem("course");

        const response = await axios.get(
          "http://localhost:5000/api/assignments/files"
        );
        const assignments = response.data;

        // Filter assignments based on user's sections and course
        const visibleAssignments = assignments.filter(
          (assignment) =>
            userSections.includes(assignment.section) &&
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

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedAssignment(null);
    setFormData({
      file: null,
      remarks: "",
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const handleRemarksChange = (e) => {
    setFormData({
      ...formData,
      remarks: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const { file, remarks } = formData;
    if (!file) {
      setError("Please select a file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("studentSection", studentSection);
      formData.append("studentName", username);
      formData.append("file", file);
      formData.append("remarks", remarks);
      formData.append("moduleName", selectedAssignment.module);
      formData.append("assignmentId", selectedAssignment._id);
      formData.append("totalMark", selectedAssignment.mark);
      formData.append("assignmentTitle", selectedAssignment.assignmentTitle);
      // Send assignment data to the backend
      await axios.post(
        "http://localhost:5000/api/submissions/submit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage("Assignment submitted successfully!");
      setShowModal(false);
    } catch (error) {
      console.error(error);
      setError("Failed to submit assignment.");
    }
  };

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
                    <th>Uploaded By:</th>
                    <th>Module Name</th>
                    <th>Assignment Description</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>File</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
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
                        <a
                          href={`http://localhost:5000/uploads/${file.filename}`}
                          download
                        >
                          {file.filename}
                        </a>
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => {
                            setSelectedAssignment(file);
                            setShowModal(true);
                          }}
                        >
                          Submit Assignment
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for submitting assignment */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="file">
              <Form.Label>Select File</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group controlId="remarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.remarks}
                onChange={handleRemarksChange}
              />
            </Form.Group>
          </Form>
          {error && <p className="text-danger">{error}</p>}
          {successMessage && <p className="text-success">{successMessage}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewAssignment;
