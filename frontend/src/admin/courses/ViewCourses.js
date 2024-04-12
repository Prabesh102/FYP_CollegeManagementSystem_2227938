import React, { useState, useEffect } from "react";
import Navbar from "../main/Navbar";
import { Modal, Button, Form } from "react-bootstrap";

const ViewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedCredits, setUpdatedCredits] = useState(0);
  const [updatedStudentsAllocated, setUpdatedStudentsAllocated] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);

  const [formData, setFormData] = useState({
    courseName: "",
    totalCredits: "",
    modules: "",
  });
  const [updatedModulesCount, setUpdatedModulesCount] = useState(0);
  const [updatedModules, setUpdatedModules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(8);

  const handleUpdateClick = (course) => {
    setSelectedCourse(course);
    setShowUpdateModal(true);
    setUpdatedName(course.courseName);
    setUpdatedCredits(course.totalCredits);
    setUpdatedModulesCount(course.modules.length);
    setUpdatedModules(course.modules.map((module) => ({ ...module })));
  };
  const handleAddSectionClick = () => {
    setShowAddSectionModal(true);
  };

  const handleAddSectionClose = () => {
    setShowAddSectionModal(false);
  };

  const handleAddSectionSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/courses/postCourse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseName: formData.courseName,
            totalCredits: formData.totalCredits,
            totalModules: formData.totalModules,
            modules: formData.modules,
          }),
        }
      );

      if (response.ok) {
        // Handle successful registration
        console.log("Course added successfully");
        // Close the modal or handle any other UI updates
        setShowAddSectionModal(false);
        setAlertMessage("Course added successfully!");
      } else {
        // Handle errors
        console.error("Failed to add course");
        setAlertMessage("Failed to add course. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/courses/getAllCourse"
        );
        if (response.ok) {
          const data = await response.json();
          setCourses(data); // Update state with fetched course data
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClose = () => {
    setSelectedCourse(null);
  };

  const handleUpdateClose = () => {
    setShowUpdateModal(false);
    setSelectedCourse(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/updateCourse/${selectedCourse._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseName: updatedName,
            totalCredits: updatedCredits,
            totalModules: updatedModulesCount,
            modules: updatedModules, // Use updatedModules instead of formData.modules
          }),
        }
      );

      if (response.ok) {
        const updatedCourses = [...courses];
        const updatedCourseIndex = updatedCourses.findIndex(
          (course) => course._id === selectedCourse._id
        );

        updatedCourses[updatedCourseIndex] = {
          ...selectedCourse,
          courseName: updatedName,
          totalCredits: updatedCredits,
          modules: updatedModules.map((module) => ({
            moduleName: module.moduleName || "",
          })),
        };

        setCourses(updatedCourses);

        setShowUpdateAlert(true);
        setShowUpdateModal(false);
        setSelectedCourse(null);
      } else {
        setShowUpdateAlert(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/deleteCourse/${selectedCourse._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setShowDeleteAlert(true);
        setShowDeleteConfirmation(false);
        // You may want to refresh the course list after deletion
      } else {
        setShowDeleteAlert(false);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };
  const handleViewClick = (course) => {
    setSelectedCourse(course);
    setShowViewModal(true);
  };
  const handleModuleChange = (index, key, value) => {
    const updatedModulesCopy = [...updatedModules];
    if (!updatedModulesCopy[index]) {
      updatedModulesCopy[index] = {};
    }
    updatedModulesCopy[index][key] = value;
    setUpdatedModules(updatedModulesCopy);
  };
  const handleCloseView = () => {
    setSelectedCourse(null);
    setShowViewModal(false);
  };
  const handleDeleteClick = (course) => {
    setSelectedCourse(course);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteClose = () => {
    setShowDeleteConfirmation(false);
  };
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <>
      <Navbar />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />
      <div className="viewTable" style={{ paddingTop: "60px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="ml-auto">
            <input
              type="text"
              className="form-control form-control-sl border-black text-black"
              placeholder="Search by course name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-end mb-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddSectionClick}
            >
              <i class="fa-solid fa-plus"></i> Add Course
            </button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">S/N</th>
              <th scope="col">Course Name</th>
              <th scope="col">Total Credits</th>
              <th scope="col">Total Modules</th>
              <th scope="col" style={{ textAlign: "left" }}>
                All Modules
              </th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.map((course, index) => (
              <tr key={course._id}>
                <th scope="row">{index + 1}</th>
                <td>{course.courseName}</td>
                <td>{course.totalCredits}</td>
                <td>{course.modules.length}</td>
                <td style={{ textAlign: "left" }}>
                  {course.modules.map((module, index) => (
                    <div key={index}>
                      <i class="fa-solid fa-book-open"></i> {module.moduleName}
                    </div>
                  ))}
                </td>

                <td>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() => handleViewClick(course)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdateClick(course)}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={() => handleDeleteClick(course)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav>
          <ul className="pagination">
            {Array.from(
              { length: Math.ceil(courses.length / coursesPerPage) },
              (_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <a
                    onClick={() => paginate(index + 1)}
                    className="page-link"
                    href="#"
                  >
                    {index + 1}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>
        {showDeleteAlert && (
          <div className="alert alert-success" role="alert">
            Course deleted successfully!
          </div>
        )}
        {showUpdateAlert && (
          <div className="alert alert-success" role="alert">
            Course details updated successfully!
          </div>
        )}

        <Modal show={showDeleteConfirmation} onHide={handleDeleteClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this course?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUpdateModal} onHide={handleUpdateClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label>Course name</label>
              <input
                type="text"
                name="updatedName"
                className="form-control"
                placeholder="Enter updated name"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Total credits</label>
              <input
                type="number"
                name="updatedCredits"
                className="form-control"
                placeholder="Enter total credits"
                value={updatedCredits}
                onChange={(e) => setUpdatedCredits(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Total modules</label>
              <input
                type="number"
                name="updatedModules"
                className="form-control"
                placeholder="Enter total modules"
                value={updatedModulesCount}
                onChange={(e) => setUpdatedModulesCount(e.target.value)}
                required
              />
            </div>

            {Array.from({ length: updatedModulesCount }, (_, index) => (
              <div key={index}>
                <Form.Group controlId={`formUpdatedModuleName${index + 1}`}>
                  <Form.Label>{`Module ${index + 1} Name`}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={`Enter module ${index + 1} name`}
                    value={
                      updatedModules[index]
                        ? updatedModules[index].moduleName
                        : ""
                    }
                    onChange={(e) =>
                      handleModuleChange(index, "moduleName", e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleUpdateClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdateSubmit}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showViewModal} onHide={handleCloseView}>
          <Modal.Header closeButton>
            <Modal.Title>Course Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Course Name: {selectedCourse?.courseName}</p>
            <p>Total Credits: {selectedCourse?.totalCredits}</p>
            <p>Modules:</p>
            <ul>
              {selectedCourse?.modules.map((module, index) => (
                <li key={index}>
                  <i className="fa-solid fa-book-open"></i> {module.moduleName}
                </li>
              ))}
            </ul>
            {/* Add other details you want to display */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseView}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showAddSectionModal} onHide={handleAddSectionClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label>Course name</label>
              <input
                type="text"
                name="courseName"
                className="form-control"
                placeholder="Enter course name"
                value={formData.courseName}
                onChange={(e) =>
                  setFormData({ ...formData, courseName: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label>Total credits</label>
              <input
                type="number"
                name="totalCredits"
                className="form-control"
                placeholder="Enter total credits "
                value={formData.totalCredits}
                onChange={(e) =>
                  setFormData({ ...formData, totalCredits: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label>Total modules</label>
              <input
                type="number"
                name="totalModules"
                className="form-control"
                placeholder="Enter total modules "
                value={formData.totalModules}
                onChange={(e) =>
                  setFormData({ ...formData, totalModules: e.target.value })
                }
                required
              />
            </div>

            {/* Dynamically render module input fields */}
            {Array.from({ length: formData.totalModules }, (_, index) => (
              <div key={index}>
                <Form.Group controlId={`formModuleName${index + 1}`}>
                  <Form.Label>{`Module ${index + 1} Name`}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={`Enter module ${index + 1} name`}
                    value={
                      updatedModules[index]
                        ? updatedModules[index].moduleName
                        : ""
                    }
                    onChange={(e) =>
                      handleModuleChange(index, "moduleName", e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddSectionClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddSectionSubmit}>
              Add Course
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ViewCourses;
