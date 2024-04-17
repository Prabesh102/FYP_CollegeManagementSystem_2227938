import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Alert, Card } from "react-bootstrap";
import moment from "moment-timezone";
import Sidebar from "../Sidebar";
import "../teacher.css";
import { Link } from "react-router-dom";
function ViewAssignmentByTeacher() {
  const [lastAssignment, setLastAssignment] = useState(null);
  const [secondLastAssignment, setSecondLastAssignment] = useState(null);
  const [lastAssignmentByTeachername, setLastAssignmentByTeachername] =
    useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [
    secondLastAssignmentByTeachername,
    setSecondLastAssignmentByTeachername,
  ] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [selectedFile, setSelectedFile] = useState(null);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [files, setFiles] = useState([]);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
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
  useEffect(() => {
    const fetchSecondLastAssignmentByTeachername = async () => {
      try {
        const teacherName = localStorage.getItem("username");
        const module = localStorage.getItem("module");
        const response = await axios.get(
          `http://localhost:5000/api/assignments/secondLastAssignment/${teacherName}/${module}`
        );
        setSecondLastAssignmentByTeachername(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSecondLastAssignmentByTeachername();
  }, []);

  useEffect(() => {
    const fetchLastAssignmentByTeachername = async () => {
      try {
        const teacherName = localStorage.getItem("username");
        const module = localStorage.getItem("module");
        const response = await axios.get(
          `http://localhost:5000/api/assignments/lastAssignment/${teacherName}/${module}`
        );
        setLastAssignmentByTeachername(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLastAssignmentByTeachername();
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
  useEffect(() => {
    const fetchSecondLastAssignment = async () => {
      try {
        const module = localStorage.getItem("module");
        const response = await axios.get(
          `http://localhost:5000/api/assignments/secondLastAssignment/${module}`
        );
        setSecondLastAssignment(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSecondLastAssignment();
  }, []);
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

  useEffect(() => {
    const fetchLastAssignment = async () => {
      try {
        const module = localStorage.getItem("module");
        const response = await axios.get(
          `http://localhost:5000/api/assignments/lastAssignment/${module}`
        );
        setLastAssignment(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLastAssignment();
  }, []);

  return (
    <div style={{ display: "flex", marginLeft: "12px" }}>
      <Sidebar />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ marginLeft: "50px" }}>
          {" "}
          <div style={{ marginTop: "50px" }}>
            <h4>Latest Assignments</h4>
          </div>
          <hr
            style={{ backgroundColor: "black", height: "2px", border: "none" }}
          />{" "}
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
              <Button
                variant="secondary"
                onClick={() => setShowAddModal(false)}
              >
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
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex" }}>
              <div
                className="card-container-assignment"
                style={{
                  width: "400px",
                  marginTop: "10px",
                  display: "flex",
                  marginRight: "5px",
                  height: "220px",
                }}
              >
                {lastAssignment && (
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
                          <Card.Title>
                            {lastAssignment.assignmentTitle}
                          </Card.Title>
                          <Card.Text
                            style={{
                              color: "#b2b2b2",
                              height: "50px",
                              fontSize: "13px",
                              width: "250px",
                            }}
                          >
                            {lastAssignment.assignmentDescription}
                          </Card.Text>
                          <Card.Text>-{lastAssignment.teacherName}</Card.Text>
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
                            {moment(lastAssignment.startDate).format(
                              "YYYY/MM/DD"
                            )}
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
                            class="fa-solid fa-marker"
                            style={{ marginRight: "3px" }}
                          ></i>
                          Marks :{lastAssignment.mark}
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
                            {moment(lastAssignment.endDate).format(
                              "YYYY/MM/DD HH:mm"
                            )}
                          </Card.Text>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </div>
              <div
                style={{ width: "400px", marginTop: "10px", height: "auto" }}
              >
                {" "}
                {secondLastAssignment && (
                  <Card
                    style={{
                      justifyContent: "center",
                      textAlign: "center",
                      backgroundColor: "#ffffff",
                      borderRadius: "20px",
                      boxShadow: "inherit",
                      height: "220px",
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
                          <Card.Title>
                            {secondLastAssignment.assignmentTitle}
                          </Card.Title>
                          <Card.Text
                            style={{
                              color: "#b2b2b2",
                              height: "50px",
                              fontSize: "13px",
                              width: "250px",
                            }}
                          >
                            {secondLastAssignment.assignmentDescription}
                          </Card.Text>
                          <Card.Text>
                            -{secondLastAssignment.teacherName}
                          </Card.Text>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <Card.Text
                            style={{ fontSize: "15px", color: "#c3c3c3" }}
                          >
                            <i
                              className="fa-solid fa-calendar-days"
                              style={{ marginRight: "3px" }}
                            ></i>{" "}
                            Assigned <br></br>-{" "}
                            {moment(secondLastAssignment.startDate).format(
                              "YYYY/MM/DD"
                            )}
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
                            class="fa-solid fa-marker"
                            style={{ marginRight: "3px" }}
                          ></i>
                          Marks :{secondLastAssignment.mark}
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
                            {moment(secondLastAssignment.endDate).format(
                              "YYYY/MM/DD HH:mm"
                            )}
                          </Card.Text>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </div>
            </div>
            <div className="operations" style={{ marginLeft: "50px" }}>
              <h5>Operations</h5>
              <hr />
              <div
                className="buttons"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Button
                  variant="primary"
                  onClick={() => setShowAddModal(true)}
                  style={{
                    height: "50px",
                  }}
                >
                  Add Assignment
                </Button>

                <Button
                  variant="primary"
                  as={Link}
                  to="/teacher/viewAllAssignments"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    alignItems: "center",
                    height: "50px",
                    marginTop: "20px",
                  }}
                >
                  View All Assignments
                </Button>
                <Button
                  variant="primary"
                  as={Link}
                  to="/teacher/viewSubmission"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    alignItems: "center",
                    height: "50px",
                    marginTop: "20px",
                  }}
                >
                  View Submissions
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginLeft: "50px" }}>
          {" "}
          <div style={{ marginTop: "40px" }}>
            <h4>Latest Assignments Posted By Me</h4>
          </div>
          <hr
            style={{ backgroundColor: "black", height: "2px", border: "none" }}
          />
          <div style={{ display: "flex" }}>
            <div
              className="card-container-assignment"
              style={{
                width: "400px",
                marginTop: "10px",
                display: "flex",
                marginRight: "5px",
              }}
            >
              {lastAssignmentByTeachername && (
                <Card
                  style={{
                    justifyContent: "center",
                    textAlign: "center",
                    backgroundColor: "#ffffff",
                    borderRadius: "20px",
                    boxShadow: "inherit",
                    height: "220px",
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
                        <Card.Title>
                          {lastAssignmentByTeachername.assignmentTitle}
                        </Card.Title>
                        <Card.Text
                          style={{
                            color: "#b2b2b2",
                            height: "50px",
                            fontSize: "13px",
                            width: "250px",
                          }}
                        >
                          {lastAssignmentByTeachername.assignmentDescription}
                        </Card.Text>
                        <Card.Text>- Posted by me</Card.Text>
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
                          {moment(lastAssignmentByTeachername.startDate).format(
                            "YYYY/MM/DD"
                          )}
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
                          class="fa-solid fa-marker"
                          style={{ marginRight: "3px" }}
                        ></i>
                        Marks :{lastAssignmentByTeachername.mark}
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
                          {moment(lastAssignmentByTeachername.endDate).format(
                            "YYYY/MM/DD HH:mm"
                          )}
                        </Card.Text>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>
            <div style={{ width: "400px", marginTop: "10px", height: "auto" }}>
              {" "}
              {secondLastAssignmentByTeachername && (
                <Card
                  style={{
                    justifyContent: "center",
                    textAlign: "center",
                    backgroundColor: "#ffffff",
                    borderRadius: "20px",
                    boxShadow: "inherit",
                    height: "220px",
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
                        <Card.Title>
                          {secondLastAssignmentByTeachername.assignmentTitle}
                        </Card.Title>
                        <Card.Text
                          style={{
                            color: "#b2b2b2",
                            height: "50px",
                            fontSize: "13px",
                            width: "250px",
                          }}
                        >
                          {
                            secondLastAssignmentByTeachername.assignmentDescription
                          }
                        </Card.Text>
                        <Card.Text>- Posted by me</Card.Text>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Card.Text
                          style={{ fontSize: "15px", color: "#c3c3c3" }}
                        >
                          <i
                            className="fa-solid fa-calendar-days"
                            style={{ marginRight: "3px" }}
                          ></i>{" "}
                          Assigned <br></br>-{" "}
                          {moment(
                            secondLastAssignmentByTeachername.startDate
                          ).format("YYYY/MM/DD")}
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
                          class="fa-solid fa-marker"
                          style={{ marginRight: "3px" }}
                        ></i>
                        Marks :{secondLastAssignmentByTeachername.mark}
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
                          {moment(
                            secondLastAssignmentByTeachername.endDate
                          ).format("YYYY/MM/DD HH:mm")}
                        </Card.Text>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewAssignmentByTeacher;
