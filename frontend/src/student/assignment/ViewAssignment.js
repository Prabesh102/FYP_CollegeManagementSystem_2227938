import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import { Modal, Button, Form, Card } from "react-bootstrap"; // Import Card from react-bootstrap
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
        const userSectionsString = localStorage.getItem("sections");
        const userSections = JSON.parse(userSectionsString);
        const userCourse = localStorage.getItem("course");

        const response = await axios.get(
          "http://localhost:5000/api/assignments/files"
        );
        const assignments = response.data;

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
              {files.map((assignment) => (
                <div
                  className="card-container-assignment"
                  key={assignment._id}
                  style={{
                    width: "400px",
                    marginTop: "10px",
                    display: "flex",
                    marginRight: "5px",
                    height: "300px",
                  }}
                >
                  <Card
                    style={{
                      justifyContent: "center",
                      textAlign: "center",
                      backgroundColor: "#ffffff",
                      borderRadius: "20px",
                      boxShadow: "inherit",
                    }}
                  >
                    <Card.Body style={{ textAlign: "left" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <Card.Title>{assignment.assignmentTitle}</Card.Title>
                          <Card.Text
                            style={{
                              color: "#b2b2b2",
                              height: "50px",
                              fontSize: "13px",
                              width: "250px",
                            }}
                          >
                            {assignment.assignmentDescription}
                          </Card.Text>
                          <Card.Text>-{assignment.teacherName}</Card.Text>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <Card.Text
                            style={{ fontSize: "15px", color: "#c3c3c3" }}
                          >
                            <i
                              className="fa-solid fa-calendar-days"
                              style={{ marginRight: "3px" }}
                            ></i>{" "}
                            Assigned -{" "}
                            {moment(assignment.startDate).format("YYYY/MM/DD")}
                          </Card.Text>
                        </div>{" "}
                      </div>{" "}
                      <div
                        style={{
                          display: "flex",
                          fontSize: "12px",
                          marginTop: "30px",
                        }}
                      >
                        {" "}
                        <div
                          style={{
                            display: "flex",
                            backgroundColor: "#b7e4cc",
                            width: "120px",
                            height: "30px",
                            justifyContent: "center",
                            textAlign: "center",
                            alignItems: "center",
                            borderRadius: "10px",
                          }}
                        >
                          <i
                            className="fa-solid fa-marker"
                            style={{ marginRight: "3px" }}
                          ></i>
                          Marks :{assignment.mark}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            backgroundColor: "#fdd68d",
                            width: "190px",
                            height: "30px",
                            justifyContent: "center",
                            textAlign: "center",
                            alignItems: "center",
                            borderRadius: "10px",
                            marginLeft: "10px",
                          }}
                        >
                          {" "}
                          <i
                            className="fa-solid fa-calendar-days"
                            style={{ marginRight: "3px" }}
                          ></i>{" "}
                          <Card.Text>
                            Deadline:{" "}
                            {moment(assignment.endDate).format(
                              "YYYY/MM/DD HH:mm"
                            )}
                          </Card.Text>
                        </div>
                      </div>
                      <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <Button
                          variant="primary"
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowModal(true);
                          }}
                        >
                          Submit Assignment
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
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
