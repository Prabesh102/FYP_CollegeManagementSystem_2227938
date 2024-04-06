import React, { useState } from "react";
import axios from "axios";

const ViewResult = () => {
  const [studentName, setStudentName] = useState("");
  const [studentSection, setStudentSection] = useState("");
  const [noOfSubject, setNoOfSubject] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [subjectInputs, setSubjectInputs] = useState([]);

  const handleSubjectChange = (index, event) => {
    const newSubjects = [...subjects];
    newSubjects[index][event.target.name] = event.target.value;
    setSubjects(newSubjects);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { subjectName: "", obtainedMarks: "" }]);
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setSubjects(newSubjects);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const resultData = {
        studentName,
        studentSection,
        noOfSubject,
        subjects,
      };

      const response = await axios.post(
        "http://localhost:5000/api/result/",
        resultData
      );
      console.log(response.data);
      // Optionally, you can redirect the user or show a success message
    } catch (error) {
      console.error("Error posting result:", error);
      // Handle error
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Post Result</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student Name</label>
          <input
            type="text"
            className="form-control"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Student Section</label>
          <input
            type="text"
            className="form-control"
            value={studentSection}
            onChange={(e) => setStudentSection(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>No of Subjects</label>
          <input
            type="number"
            className="form-control"
            value={noOfSubject}
            onChange={(e) => {
              setNoOfSubject(parseInt(e.target.value));
              setSubjects([]);
            }}
          />
        </div>
        {subjects.map((subject, index) => (
          <div key={index} className="row">
            <div className="form-group col-md-6">
              <label>Subject Name</label>
              <input
                type="text"
                className="form-control"
                name="subjectName"
                value={subject.subjectName}
                onChange={(e) => handleSubjectChange(index, e)}
              />
            </div>
            <div className="form-group col-md-5">
              <label>Obtained Marks</label>
              <input
                type="text"
                className="form-control"
                name="obtainedMarks"
                value={subject.obtainedMarks}
                onChange={(e) => handleSubjectChange(index, e)}
              />
            </div>
            <div className="form-group col-md-1 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => handleRemoveSubject(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="form-group">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleAddSubject}
          >
            Add Subject
          </button>
        </div>
        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ViewResult;
