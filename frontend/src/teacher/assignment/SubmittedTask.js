import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Form } from "react-bootstrap";
import moment from "moment-timezone";
import Sidebar from "../Sidebar";
import "../teacher.css";
import { useParams } from "react-router-dom";

const SubmittedTask = () => {
  const { assignmentId } = useParams();
  const [submissionDetails, setSubmissionDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [obtainedMark, setObtainedMark] = useState("");

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/submissions/submissions/${assignmentId}`
        );
        setSubmissionDetails(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSections = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/section/getAllSection`
        );
        setSections(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSubmissionDetails();
    fetchSections();
  }, [assignmentId]);

  // Calculate index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = submissionDetails.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fetch submission details by section
  const fetchSubmissionBySection = async (section) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/submissions/submissions/${assignmentId}/${section}`
      );
      setSubmissionDetails(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle section selection change
  const handleSectionChange = (e) => {
    const section = e.target.value;
    setSelectedSection(section);
    fetchSubmissionBySection(section);
  };

  // Show modal for providing mark
  const handleProvideMark = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSubmission(null);
    setObtainedMark("");
  };

  // Handle obtained mark change
  const handleObtainedMarkChange = (e) => {
    setObtainedMark(e.target.value);
  };

  // Handle submission of obtained mark
  const handleSubmitMark = async () => {
    try {
      const { studentName, studentSection, moduleName, totalMark } =
        selectedSubmission;

      // Make a POST request to submit the obtained mark
      await axios.post("http://localhost:5000/api/resultMaker", {
        studentName,
        studentSection,
        moduleName,
        totalMark,
        obtainedMark,
      });

      // Close the modal and reset state
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting mark:", error);
    }
  };
  return (
    <>
      <div style={{ display: "flex", marginLeft: "12px" }}>
        <Sidebar />
        <div
          className="col-md-9"
          style={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          {currentItems.length > 0 && (
            <div>
              <h2>Submitted Assignment Details</h2>
              {/* Section filter dropdown */}
              <Form.Group style={{ marginBottom: "20px" }}>
                <Form.Label>Select Section</Form.Label>
                <Form.Control
                  as="select"
                  onChange={handleSectionChange}
                  value={selectedSection}
                >
                  <option value="">All Sections</option>
                  {sections.map((section) => (
                    <option key={section._id} value={section.sectionName}>
                      {section.sectionName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Section</th>
                    <th>Assignment Title</th>
                    <th>Remarks</th>

                    <th>Submission Time</th>
                    <th>File</th>
                    <th>Operation</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((submission) => (
                    <tr key={submission._id}>
                      <td>{submission.studentName}</td>
                      <td>{submission.studentSection}</td>
                      <td>{submission.assignmentTitle}</td>
                      <td>{submission.remarks}</td>
                      <td>
                        {moment(submission.timestamp).format(
                          "YYYY-MM-DD HH:mm"
                        )}
                      </td>
                      <td>
                        <a
                          href={`http://localhost:5000/${submission.file}`}
                          download
                        >
                          Download
                        </a>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleProvideMark(submission)}
                        >
                          Provide Mark
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={submissionDetails.length}
                paginate={paginate}
              />
            </div>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Provide Mark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Full Mark: {selectedSubmission && selectedSubmission.totalMark}</p>
          <Form.Group controlId="obtainedMark">
            <Form.Label>Obtained Mark</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter obtained mark"
              value={obtainedMark}
              onChange={handleObtainedMarkChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitMark}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Pagination component
const Pagination = ({ itemsPerPage, totalItems, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a onClick={() => paginate(number)} href="!#" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SubmittedTask;
