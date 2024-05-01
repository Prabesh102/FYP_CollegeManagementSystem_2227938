import React, { useState, useEffect } from "react";
import Navbar from "../main/Navbar";
import "../main/admin.css";
import { Modal, Button, Form } from "react-bootstrap";

const ViewStudents = () => {
  const [selectedSection, setSelectedSection] = useState("");
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedSemester, setUpdatedSemester] = useState("");
  const [updatedSection, setUpdatedSection] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [sections, setSections] = useState([]); // Add state for sections
  const [courses, setCourses] = useState([]);
  const ITEMS_PER_PAGE = 7;
  const [showAddFromExcelModal, setShowAddFromExcelModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    registrationDate: new Date().toISOString(),
    sections: [],
    course: "",
  });

  // Fetch sections when the component mounts
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
  const handleAddUserClick = () => {
    setShowAddUserModal(true);
  };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleAddUserClose = () => {
    setShowAddUserModal(false);
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Form Data:", formData);
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          registrationDate: formData.registrationDate,
          sections: formData.sections,
          course: formData.course,
        }),
      });
      console.log("Sending request with payload:", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        registrationDate: formData.registrationDate,
        sections: formData.sections,
        course: formData.course,
      });

      console.log("Server response:", response); // Log the server response
      if (response.ok) {
        // Handle successful registration
        console.log("User added successfully");
        // Close the modal or handle any other UI updates
        setShowAddUserModal(false);
        setAlertMessage("User added successfully!");
      } else {
        // Handle errors
        console.error("Failed to add user");
        setAlertMessage("Failed to add user. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Function to open the modal for adding students from Excel
  const handleAddFromExcelClick = () => {
    setShowAddFromExcelModal(true);
  };

  // Function to close the modal for adding students from Excel
  const handleAddFromExcelClose = () => {
    setShowAddFromExcelModal(false);
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/registerFromFile",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("File uploaded successfully:", data);
        // Display success message to the user or update UI as needed
      } else {
        console.error("Failed to upload file");
        // Display error message to the user or handle error appropriately
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      // Display error message to the user or handle error appropriately
    }
  };
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/getAllStudents"
        );
        if (response.ok) {
          const data = await response.json();
          setStudents(data); // Update state with fetched student data
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClose = () => {
    setSelectedUser(null);
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const handleUpdateClose = () => {
    setShowUpdateModal(false);
    setUpdatedName("");
    setUpdatedEmail("");
    setUpdatedSemester("");
    setUpdatedSection("");
    setSelectedUser(null);
  };
  const handleView = (user) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true); // Show the "View User Details" modal
  };

  const handleCloseUserDetails = () => {
    setSelectedUser(null);
    setShowUserDetailsModal(false); // Close the "View User Details" modal
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/updateUserDetails",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: selectedUser._id,
            updatedName,
            updatedEmail,

            updatedSemester,
            updatedSection,
          }),
        }
      );

      if (response.ok) {
        // Handle successful update
        console.log("User details updated successfully");
        // Close the modal or handle any other UI updates
        setShowUpdateModal(false);
        setUpdatedName("");
        setUpdatedEmail("");
        setUpdatedSection("");
        setUpdatedSemester("");
        setSelectedUser(null);
        setShowUpdateAlert(true);
      } else {
        // Handle errors
        console.error("Failed to update user details");
        setShowUpdateAlert(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user); // Set the selected user
    setShowDeleteConfirmation(true); // Show the delete confirmation modal
  };

  const handleDeleteClose = () => {
    setSelectedUser(null);
    setShowDeleteConfirmation(false);
  };

  const handleDelete = async (userId) => {
    try {
      if (!selectedUser) {
        console.error("No user selected for deletion");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/users/deleteUser/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setShowDeleteAlert(true);
        setShowDeleteConfirmation(false);
      } else {
        setShowDeleteAlert(false);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      // Handle error or show a message to the user
    }
  };
  const [currentPage, setCurrentPage] = useState(1);

  const lastStudentIndex = currentPage * ITEMS_PER_PAGE;
  const firstStudentIndex = lastStudentIndex - ITEMS_PER_PAGE;
  const currentStudents = filteredStudents.slice(
    firstStudentIndex,
    lastStudentIndex
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (lastStudentIndex < students.length) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handleAddFromExcelSubmit = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/registerFromFile",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("File uploaded successfully:", data);
        // Display success message to the user or update UI as needed
      } else {
        console.error("Failed to upload file");
        // Display error message to the user or handle error appropriately
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      // Display error message to the user or handle error appropriately
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />
      <Navbar />
      <div className="viewTable" style={{ paddingTop: "60px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="ml-auto">
            <input
              type="text"
              className="form-control form-control-sl border-black text-black"
              placeholder="Search by username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-end mb-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddUserClick}
            >
              Add User By Form
            </button>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddFromExcelClick}
          >
            Add Student By Excel Sheet
          </button>{" "}
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">S/N</th>
              <th scope="col">
                <i class="fa-solid fa-user"></i> Username
              </th>
              <th scope="col">
                <i class="fa-regular fa-envelope"></i> Email
              </th>
              <th scope="col">
                <i class="fa-regular fa-calendar-days"></i> Registration Date
              </th>
              <th scope="col">
                <i class="fa-solid fa-book"></i> Course
              </th>
              <th scope="col">
                <i class="fa-solid fa-landmark"></i> Section
              </th>
              <th scope="col">
                <i class="fa-solid fa-book"></i> Semester
              </th>

              <th scope="col">
                <i class="fa-solid fa-gear"></i> Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student, index) => (
              <tr key={student._id}>
                <th scope="row">{index + 1}</th>
                <td>{student.username}</td>
                <td>{student.email}</td>
                <td>
                  {new Date(student.registrationDate).toLocaleDateString()}
                </td>
                <td>{student.course}</td>
                <td>{student.sections ? student.sections.join(", ") : ""}</td>
                <td>{student.semester}</td>

                <td>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() => handleView(student)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdateClick(student)}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={() => handleDeleteClick(student)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showDeleteAlert && (
          <div className="alert alert-success" role="alert">
            User deleted successfully!
          </div>
        )}

        {showUpdateAlert && (
          <div className="alert alert-success" role="alert">
            User details updated successfully!
          </div>
        )}
        {alertMessage && (
          <div className="alert alert-success" role="alert">
            User added successfully!
          </div>
        )}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary me-2"
            disabled={currentPage === 1}
            onClick={handlePreviousClick}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={lastStudentIndex >= students.length}
            onClick={handleNextClick}
          >
            Next
          </button>
        </div>
        <Modal show={showDeleteConfirmation} onHide={handleDeleteClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this user?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(selectedUser?._id)}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUpdateModal} onHide={handleUpdateClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateSubmit}>
              <Form.Group controlId="formUpdateName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter updated name"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formUpdateEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter updated email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formUpdateEmail">
                <Form.Label>Semester</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter updated email"
                  value={updatedSemester}
                  onChange={(e) => setUpdatedSemester(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formUpdateSection">
                <Form.Label>Section</Form.Label>
                <Form.Select
                  name="section"
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
                </Form.Select>
              </Form.Group>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleUpdateClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUserDetailsModal} onHide={handleCloseUserDetails}>
          <Modal.Header closeButton>
            <Modal.Title>User Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Username: {selectedUser?.username}</p>
            <p>Email: {selectedUser?.email}</p>
            <p>
              Registration Date:{" "}
              {new Date(selectedUser?.registrationDate).toLocaleDateString()}
            </p>
            <p>Semester: {selectedUser?.semester}</p>

            <p>Course: {selectedUser?.course}</p>
            <p>
              Section:{" "}
              {selectedUser?.sections && selectedUser.sections.join(", ")}
            </p>
            {/* Add other details you want to display */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseUserDetails}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showAddUserModal} onHide={handleAddUserClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label>Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter correct email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label>Role</label>
              <select
                className="form-select"
                name="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
              >
                <option value="student">Student</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Registration Date</label>
              <input
                type="date"
                name="registrationDate"
                className="form-control"
                value={formData.registrationDate}
                onChange={(e) =>
                  setFormData({ ...formData, registrationDate: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label>Course</label>
              <Form.Select
                name="course"
                value={formData.course}
                onChange={(e) => {
                  setFormData({ ...formData, course: e.target.value });
                  setSelectedCourse(e.target.value);
                }}
                required
              >
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course.courseName}>
                    {course.courseName}
                  </option>
                ))}
              </Form.Select>
            </div>
            {selectedCourse && (
              <div className="mb-3">
                <label>Sections</label>
                <Form.Select
                  name="sections"
                  value={formData.sections}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sections: Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      ),
                    })
                  }
                  required
                >
                  <option value="">Select Sections</option>
                  {sections.map((section) => (
                    <option key={section._id} value={section.sectionName}>
                      {section.sectionName}
                    </option>
                  ))}
                </Form.Select>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddUserClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddUserSubmit}>
              Add User
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showAddFromExcelModal} onHide={handleAddFromExcelClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Students From Excel</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleUploadFile}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddFromExcelClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddFromExcelSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ViewStudents;
