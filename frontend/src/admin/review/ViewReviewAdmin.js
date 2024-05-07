import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios"; // Import axios for making HTTP requests
import Navbar from "../main/Navbar";
const ViewReviewAdmin = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // Fetch section names from the backend when the component mounts
    axios
      .get("http://localhost:5000/api/section/getAllSection")
      .then((response) => {
        // Update the state with the received section names
        setSections(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sections:", error);
      });
  }, []); // Empty dependency array to ensure useEffect runs only once

  const handlePublishClick = () => {
    setShowPopup(true);
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  const handlePublishReview = () => {
    // Create an object with the schedule data to send to the backend
    const scheduleData = {
      section: selectedSection,
      startDateTime: document.getElementById("startDateTime").value,
      endDateTime: document.getElementById("endDateTime").value,
    };

    // Send a POST request to the backend API endpoint
    axios
      .post("http://localhost:5000/api/review/", scheduleData)
      .then((response) => {
        console.log("Schedule created successfully:", response.data);
        // Optionally, you can do something after successful submission
        // For example, you can close the popup
        setShowPopup(false);
      })
      .catch((error) => {
        console.error("Error creating schedule:", error);
        // Optionally, you can handle errors here
      });
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: "60px" }}>
        <h1>View Review Admin</h1>
        <button className="btn btn-primary" onClick={handlePublishClick}>
          Publish New Review
        </button>

        <Modal show={showPopup} onHide={() => setShowPopup(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Publish Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="sectionSelect" className="form-label">
                Select Section
              </label>
              <select
                id="sectionSelect"
                className="form-control"
                value={selectedSection}
                onChange={handleSectionChange}
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section._id} value={section.sectionName}>
                    {section.sectionName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="startDateTime" className="form-label">
                Start Date and Time
              </label>
              <input
                type="datetime-local"
                id="startDateTime"
                className="form-control"
                // Add value and onChange props here to handle the start date and time
              />
            </div>
            <div className="mb-3">
              <label htmlFor="endDateTime" className="form-label">
                End Date and Time
              </label>
              <input
                type="datetime-local"
                id="endDateTime"
                className="form-control"
                // Add value and onChange props here to handle the end date and time
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePublishReview}
            >
              Publish
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ViewReviewAdmin;
