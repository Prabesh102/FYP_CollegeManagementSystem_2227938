import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Sidebar from "../Sidebar";

const StudentResult = () => {
  const [studentResult, setStudentResult] = useState(null);
  const [submissions, setSubmissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [submissionResult, setSubmissionResult] = useState(null); // State to store submission result
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const submissionsPerPage = 6; // Number of submissions per page

  useEffect(() => {
    const studentName = localStorage.getItem("username");

    const fetchStudentResult = async () => {
      try {
        const [resultResponse, submissionsResponse] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/resultMaker?studentName=${studentName}`
          ),
          axios.get(
            `http://localhost:5000/api/submissions/student/${studentName}`
          ),
        ]);

        setStudentResult(resultResponse.data);
        setSubmissions(submissionsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student result:", error);
        setLoading(false);
      }
    };

    if (studentName) {
      fetchStudentResult();
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Get current submissions
  const indexOfLastSubmission = currentPage * submissionsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
  const currentSubmissions = submissions.slice(
    indexOfFirstSubmission,
    indexOfLastSubmission
  );

  const handleViewGrades = async (submissionId) => {
    const studentName = localStorage.getItem("username");

    try {
      // Fetch the result by student name and submission ID
      const response = await axios.get(
        `http://localhost:5000/api/resultMaker/student/?studentName=${studentName}&submissionId=${submissionId}`
      );

      // Set the submission result and show the modal
      setSubmissionResult(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching submission result:", error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ display: "flex", marginLeft: "12px" }}>
      <Sidebar />
      <div style={{ marginTop: "50px", marginLeft: "50px" }}>
        <h2>Submissions</h2>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {currentSubmissions.map((submission, index) => (
            <div
              key={submission._id}
              style={{
                marginRight: "30px",
                marginBottom: "30px",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "20px",
                width: "400px",
              }}
            >
              <p
                style={{
                  backgroundColor: "#b7e4cc",
                  padding: "4px",
                  textAlign: "center",
                }}
              >
                Module Name: {submission.moduleName}
              </p>
              <p>Assignment Title: {submission.assignmentTitle}</p>
              <p>Total Mark: {submission.totalMark}</p>
              <p>
                File:{" "}
                <a href={`http://localhost:5000/${submission.file}`} download>
                  Download
                </a>
              </p>
              <button
                className="btn btn-primary"
                onClick={() => handleViewGrades(submission._id)}
              >
                View Grades
              </button>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <ul className="pagination">
          {Array.from(
            { length: Math.ceil(submissions.length / submissionsPerPage) },
            (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => paginate(i + 1)}>
                  {i + 1}
                </button>
              </li>
            )
          )}
        </ul>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Grade Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {submissionResult ? (
              <>
                <p>Module Name: {submissionResult.moduleName}</p>
                <p>Total Mark: {submissionResult.totalMark}</p>
                <p>Obtained Mark: {submissionResult.obtainedMark}</p>
                {/* Add more details as needed */}
              </>
            ) : (
              <p>No grade has been published for this assignment.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default StudentResult;
