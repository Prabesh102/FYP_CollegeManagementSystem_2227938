import React, { useState, useEffect } from "react";
import Navbar from "../main/Navbar";
import "../main/admin.css";
import { Modal, Button, Form } from "react-bootstrap";

const ViewTeacher = () => {
  const [teachers, setteachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [alertMessage, setAlertMessage] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "teacher",
    registrationDate: new Date().toISOString(),
    section: "",
    course: "",
  });

  const handleAddTeacherClick = () => {
    setShowAddTeacherModal(true);
  };
  // const handleAddTeacherClose = () => {
  //   setShowAddTeacherModal(false);
  //   // Clear the form data when the modal is closed
  //   setNewTeacherData({
  //     username: "",
  //     email: "",
  //     password: "",
  //     role: "teacher",
  //     registrationDate: new Date().toISOString(),
  //     section: "",
  //     course: "",
  //   });
  // };

  const handleAddTeacherSubmit = async (e) => {
    e.preventDefault();

    try {
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
          section: formData.section,
          course: formData.course,
        }),
      });

      if (response.ok) {
        // Handle successful registration
        console.log("Teacher added successfully");
        setAlertMessage("Teacher added successfully!");
        // Close the modal using the correct method
        setShowAddTeacherModal(false);
      } else {
        const errorText = await response.text();
        console.error("Failed to add teacher:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          setAlertMessage(`Failed to add teacher: ${errorData.message}`);
        } catch (jsonError) {
          setAlertMessage(`Failed to add teacher. Please check the form data.`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("An unexpected error occurred. Please try again later.");
    }
  };

  // Update the form data state when inputs change
  // const handleNewTeacherInputChange = (e) => {
  //   setNewTeacherData({
  //     ...newTeacherData,
  //     [e.target.name]: e.target.value,
  //   });
  // };
  useEffect(() => {
    const fetchSectionsAndCourses = async () => {
      try {
        const sectionsResponse = await fetch(
          "http://localhost:5000/api/sections"
        );
        const coursesResponse = await fetch(
          "http://localhost:5000/api/courses"
        );

        if (sectionsResponse.ok && coursesResponse.ok) {
          const sectionsData = await sectionsResponse.json();
          const coursesData = await coursesResponse.json();
          setSections(sectionsData);
          setCourses(coursesData);
        } else {
          throw new Error("Failed to fetch sections and courses");
        }
      } catch (error) {
        console.error("Error fetching sections and courses:", error);
      }
    };

    fetchSectionsAndCourses();
  }, []);
  useEffect(() => {
    const fetchteacherData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/getAllTeachers"
        );
        if (response.ok) {
          const data = await response.json();
          setteachers(data); // Update state with fetched teacher data
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchteacherData();
  }, []);

  const filteredteachers = teachers.filter((teacher) =>
    teacher.username.toLowerCase().includes(searchTerm.toLowerCase())
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
  useEffect(() => {
    const fetchSectionsAndCourses = async () => {
      try {
        const sectionsResponse = await fetch(
          "http://localhost:5000/api/section/getAllSection"
        );
        const coursesResponse = await fetch(
          "http://localhost:5000/api/courses/getAllCourse"
        );

        if (sectionsResponse.ok && coursesResponse.ok) {
          const sectionsData = await sectionsResponse.json();
          const coursesData = await coursesResponse.json();
          setSections(sectionsData);
          setCourses(coursesData);
        } else {
          throw new Error("Failed to fetch sections and courses");
        }
      } catch (error) {
        console.error("Error fetching sections and courses:", error);
      }
    };

    fetchSectionsAndCourses();
  }, []);

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
              onClick={handleAddTeacherClick}
            >
              Add Teacher
            </button>
          </div>
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
                <i class="fa-regular fa-envelope"></i> Course
              </th>
              <th scope="col">
                <i class="fa-regular fa-envelope"></i> Section
              </th>
              <th scope="col">
                <i class="fa-regular fa-calendar-days"></i> Registration Date
              </th>

              <th scope="col">
                <i class="fa-regular fa-calendar-days"></i> Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredteachers.map((teacher, index) => {
              console.log("Teacher Object:", teacher);
              return (
                <tr key={teacher._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{teacher.username}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.course}</td>
                  <td>{teacher.section}</td>
                  <td>
                    {new Date(teacher.registrationDate).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      onClick={() => handleView(teacher)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning me-2"
                      onClick={() => handleUpdateClick(teacher)}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger me-2"
                      onClick={() => handleDeleteClick(teacher)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
                />
              </Form.Group>
              <Form.Group controlId="formUpdateEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter updated email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                />
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
            <p>Registration Date: {selectedUser?.registrationDate}</p>
            <p>Section: {selectedUser?.section}</p>
            <p>Course: {selectedUser?.course}</p>
            {/* Add other details you want to display */}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowAddTeacherModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showAddTeacherModal}
          onHide={() => setShowAddTeacherModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Teacher</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddTeacherSubmit}>
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
                  <option value="teacher">Teacher</option>
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
                    setFormData({
                      ...formData,
                      registrationDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label>Section</label>
                <Form.Select
                  name="section"
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                  required
                >
                  <option value="">Select Section</option>
                  {sections.map((section) => (
                    <option key={section._id} value={section.sectionName}>
                      {section.sectionName}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="mb-3">
                <label>Course</label>
                <Form.Select
                  name="course"
                  value={formData.course}
                  onChange={(e) =>
                    setFormData({ ...formData, course: e.target.value })
                  }
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course.courseName}>
                      {course.courseName}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <Button variant="primary" type="submit">
                Add Teacher
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowAddTeacherModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ViewTeacher;
