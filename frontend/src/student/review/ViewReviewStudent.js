import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";

const ViewReviewStudent = () => {
  const [schedule, setSchedule] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRatings, setSelectedRatings] = useState({});
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false); // Track if student has already submitted a review

  // Retrieve section from localStorage
  const storedSection = JSON.parse(localStorage.getItem("sections"));

  useEffect(() => {
    const url = `http://localhost:5000/api/review/review/section?section=${storedSection[0]}`;
    axios
      .get(url)
      .then((response) => {
        const { activeSchedules, teachers } = response.data;
        setSchedule(activeSchedules);
        setTeachers(teachers);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Check if the student has already submitted a review
    const checkIfReviewSubmitted = async () => {
      try {
        const studentName = localStorage.getItem("username");
        const response = await axios.get(
          `http://localhost:5000/api/review/review/getall?studentName=${studentName}`
        );
        if (response.data.length > 0) {
          setHasSubmittedReview(true);
        }
      } catch (error) {
        console.error("Error checking if review submitted:", error);
      }
    };
    checkIfReviewSubmitted();
  }, []);

  const handleReview = (rating, teacherId) => {
    // Toggle the selected rating for the corresponding teacher
    setSelectedRatings((prevRatings) => {
      const updatedRatings = { ...prevRatings };
      if (updatedRatings[teacherId] === rating) {
        // Deselect the rating if it's already selected
        delete updatedRatings[teacherId];
      } else {
        // Otherwise, select the rating
        updatedRatings[teacherId] = rating;
      }
      return updatedRatings;
    });
  };

  const allRatingsSelected = () => {
    // Check if ratings are selected for all teachers
    return teachers.every((teacher) =>
      selectedRatings.hasOwnProperty(teacher._id)
    );
  };

  const handleSubmit = () => {
    const studentName = localStorage.getItem("username");
    console.log("student name: ", studentName);
    const reviewData = {
      studentName,
      sectionName: storedSection[0],
      reviews: Object.entries(selectedRatings).map(([teacherId, review]) => ({
        teacherName: teachers.find((teacher) => teacher._id === teacherId)
          .username,
        review,
      })),
    };

    axios
      .post("http://localhost:5000/api/review/store/review", reviewData)
      .then((response) => {
        console.log("Reviews submitted successfully:", response.data);
        setHasSubmittedReview(true); // Set flag indicating that the student has submitted a review
      })
      .catch((error) => {
        console.error("Error submitting reviews:", error);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ display: "flex", marginLeft: "12px" }}>
      <Sidebar />
      <div style={{ marginTop: "50px", marginLeft: "50px" }}>
        <div>
          {schedule && (
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
              }}
            >
              <h3 style={{ padding: "10px" }}>Review the Teachers:</h3>
              {teachers.map((teacher) => (
                <div key={teacher._id} style={{ margin: "20px" }}>
                  <h4>{teacher.username}</h4>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                    <button
                      className="btn btn-primary active"
                      key={rating}
                      onClick={() => handleReview(rating, teacher._id)}
                      disabled={selectedRatings[teacher._id] === rating}
                      style={{
                        backgroundColor:
                          selectedRatings[teacher._id] === rating
                            ? "#5D3FD3"
                            : "",
                        marginRight: "5px",
                        padding: "10px",
                      }}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              ))}
              {allRatingsSelected() &&
                !hasSubmittedReview && ( // Render the button only if all ratings selected and the review has not been submitted
                  <button onClick={handleSubmit}>Submit Reviews</button>
                )}
              {hasSubmittedReview && ( // Render message if review has been submitted
                <div>You have already submitted the review.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewReviewStudent;
