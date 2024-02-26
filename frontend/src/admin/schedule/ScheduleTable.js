import React, { useState, useEffect } from "react";
import Navbar from "../main/Navbar";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import ViewSchedule from "./ViewSchedule";

const ScheduleTable = () => {
  const [schedules, setSchedules] = useState([]);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  useEffect(() => {
    // Fetch schedules data
    axios
      .get("http://localhost:5000/api/schedule/")
      .then((response) => {
        setSchedules(response.data);
      })
      .catch((error) => {
        console.error("Error fetching schedules:", error);
      });
  }, []);

  const handleAddScheduleClick = () => {
    setShowAddScheduleModal(true);
  };

  const handleAddScheduleClose = () => {
    setShowAddScheduleModal(false);
  };

  return (
    <>
      <Navbar />
      <div className="viewTable" style={{ paddingTop: "60px" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Section</th>
              <th>No of Classes</th>
              <th>Scheduled Day</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule._id}>
                <td>{schedule.section}</td>
                <td>{schedule.numberOfClass}</td>
                <td>{schedule.scheduledDay}</td>
                {/* Add more table cells as needed */}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-end mb-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddScheduleClick}
          >
            Add Schedule
          </button>
        </div>

        {/* Add a modal for ViewSchedule component */}
        <Modal show={showAddScheduleModal} onHide={handleAddScheduleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Schedule</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Render your ViewSchedule component here */}
            <ViewSchedule />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddScheduleClose}>
              Close
            </Button>
            {/* Add any additional buttons or logic here */}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ScheduleTable;
