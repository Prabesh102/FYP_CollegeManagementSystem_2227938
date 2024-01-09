import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Navbar from "../main/Navbar";
const AddCourse = () => {
  const [formData, setFormData] = useState({
    courseName: "",
    totalCredits: "",
    modules: "",
    totalStudentsAllocated: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/courses/postCourse",
        formData
      );
      console.log("Course added successfully:", response.data);
      // Optionally, you can redirect or show a success message here
    } catch (error) {
      console.error("Error adding course:", error.message);
      // Handle error or show a message to the user
    }
  };

  return (
    <>
      <Navbar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 className="text-center mb-4">Add New Course</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formCourseName">
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter course name"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formTotalCredits">
                <Form.Label>Total Credits</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter total credits"
                  name="totalCredits"
                  value={formData.totalCredits}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formModules">
                <Form.Label>Total Modules</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter number of modules"
                  name="modules"
                  value={formData.modules}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="formTotalStudentsAllocated"
              >
                <Form.Label>Total Students Allocated</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter total students allocated"
                  name="totalStudentsAllocated"
                  value={formData.totalStudentsAllocated}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddCourse;
