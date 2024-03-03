import React, { useState, useEffect } from "react";
import axios from "axios";
const ViewAssignment = () => {
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/assignments/"
        );
        const responseData = response.data;

        // Extract file data from the assignments
        const files = responseData.map(
          (assignment) => assignment.assignmentMain[0]
        );

        setFile(files);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("assignmentTitle", assignmentTitle);
    formData.append("assignmentDescription", assignmentDescription);

    formData.append("file", file, file.name);

    try {
      const response = await fetch("http://localhost:5000/api/assignments/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setAssignmentTitle("");
        setAssignmentDescription("");
        setFile(null);

        setSuccessMessage("Assignment posted successfully");
        setError(null);
      } else {
        const errorText = await response.text();
        console.error("Failed to post assignment:", errorText);

        setError(
          "Failed to post assignment. Please check your data and try again."
        );
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error("Error posting assignment:", error);

      setError("Internal Server Error. Please try again later.");
      setSuccessMessage(null);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Assignment Title:
          <input
            type="text"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
          />
        </label>
        <br />
        <label>
          Assignment Description:
          <input
            type="text"
            value={assignmentDescription}
            onChange={(e) => setAssignmentDescription(e.target.value)}
          />
        </label>
        <br />
        <label>
          Assignment File:
          <input type="file" onChange={handleFileChange} />
        </label>
        <br />
        <button type="submit">Submit Assignment</button>
      </form>
      {file && Array.isArray(file) && file.length > 0 && (
        <div>
          <h2>Files</h2>
          <ul>
            {file.map((file) => (
              <li key={file._id}>
                <a
                  href={`http://localhost:5000/api/assignments/${file.filename}`}
                  download
                >
                  {file.filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default ViewAssignment;
