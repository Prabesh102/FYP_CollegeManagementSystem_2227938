import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";
import profile from "../../image/profile.png";
import { Modal, Button } from "react-bootstrap";

const ViewLibraryTeacher = () => {
  const [library, setLibrary] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null); // Track selected book
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const booksPerPage = 8;
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/library/books")
      .then((response) => {
        setLibrary(response.data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  const indexOfLastBook = currentPage * 8;
  const indexOfFirstBook = indexOfLastBook - 8;
  const currentBooks = library.slice(indexOfFirstBook, indexOfLastBook);

  const handleViewMore = () => {
    setCurrentPage(currentPage + 1);
  };

  // Function to handle opening modal and setting selected book
  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBook(null); // Reset selected book
  };

  return (
    <>
      <div style={{ display: "flex", marginLeft: "12px" }}>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: "16px" }}>
          <div
            className="col-md-3 d-flex justify-content-end p-4"
            style={{ position: "absolute", right: "0", top: "0" }}
          ></div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: "60px",
            }}
          >
            {currentBooks.map((book) => (
              <div
                key={book.id}
                style={{
                  margin: "10px",
                  textAlign: "center",
                  backgroundColor: "white",
                  width: "23%",
                  borderRadius: "20px",
                }}
              >
                <img
                  src={book.image}
                  alt={book.bookName}
                  width="120px"
                  height="140px"
                  style={{ padding: "15px" }}
                />
                <div style={{ paddingBottom: "10px" }}>
                  <p style={{ fontSize: "18px" }}>{book.bookName}</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginLeft: "7px", backgroundColor: "#925fe2" }}
                    onClick={() => handleViewDetails(book)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {library.length > currentPage * booksPerPage && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "23%",
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                  marginLeft: "10px",
                }}
              >
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{
                    backgroundColor: "#925fe2",
                    height: "40px",
                    width: "120px",
                  }}
                  onClick={handleViewMore}
                >
                  Next Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Book Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBook && (
            <div
              style={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <h5>{selectedBook.bookName}</h5>
              <p>Category: {selectedBook.bookCategory}</p>
              <p>Price: {selectedBook.bookPrice}</p>
              <p>Total Pages: {selectedBook.totalPages}</p>
              <p>Self No: {selectedBook.selfNo}</p>
              <img
                src={selectedBook.image}
                alt={selectedBook.bookName}
                style={{ width: "120px", height: "140px" }}
              />
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewLibraryTeacher;
