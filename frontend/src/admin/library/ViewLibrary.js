import React, { useState, useEffect } from "react";
import Navbar from "../main/Navbar";
import "../main/admin.css";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
const ViewLibrary = () => {
  const [library, setLibrary] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedBookCategory, setUpdatedBookCategory] = useState("");
  const [updatedBookPrice, setUpdatedBookPrice] = useState("");
  const [updatedTotalPages, setUpdatedTotalPages] = useState("");
  const [updatedSelfNo, setUpdatedSelfNo] = useState("");
  const [updatedImage, setUpdatedImage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showLibraryDetailsModal, setShowLibraryDetailsModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [showAddLibraryModal, setShowAddLibraryModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [formData, setFormData] = useState({
    bookName: "",
    bookCategory: "",
    bookPrice: "",
    totalPages: "",
    selfNo: "",
    image: null,
  });
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/library/books")
      .then((response) => {
        setLibrary(response.data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  const handleAddLibraryClick = () => {
    setShowAddLibraryModal(true);
  };

  const handleAddLibraryClose = () => {
    setShowAddLibraryModal(false);
  };

  const handleAddLibrarySubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("bookName", formData.bookName);
      formDataToSend.append("bookCategory", formData.bookCategory);
      formDataToSend.append("bookPrice", formData.bookPrice);
      formDataToSend.append("totalPages", formData.totalPages);
      formDataToSend.append("selfNo", formData.selfNo);
      formDataToSend.append("image", formData.image);

      const response = await axios.post(
        "http://localhost:5000/api/library/books",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Book created:", response.data);

      setFormData({
        bookName: "",
        bookCategory: "",
        bookPrice: "",
        totalPages: "",
        selfNo: "",
        image: null,
      });
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  const filteredLibrary = library.filter((library) =>
    library.bookName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClose = () => {
    setSelectedLibrary(null);
  };

  const handleUpdateClick = (section) => {
    setSelectedLibrary(section);
    setShowUpdateModal(true);
  };

  const handleUpdateClose = () => {
    setShowUpdateModal(false);
    setUpdatedName("");
    // setUpdatedStudentNumber("");
    setSelectedLibrary(null);
  };
  const handleView = (library) => {
    setSelectedLibrary(library);
    setShowLibraryDetailsModal(true);
  };

  const handleCloseLibraryDetails = () => {
    setSelectedLibrary(null);
    setShowLibraryDetailsModal(false);
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Check if updatedImage is a file or a string
      if (updatedImage instanceof File) {
        formDataToSend.append("image", updatedImage);
      }

      formDataToSend.append("bookName", updatedName);
      formDataToSend.append("bookCategory", updatedBookCategory);
      formDataToSend.append("bookPrice", updatedBookPrice);
      formDataToSend.append("totalPages", updatedTotalPages);
      formDataToSend.append("selfNo", updatedSelfNo);

      const response = await fetch(
        `http://localhost:5000/api/library/books/${selectedLibrary._id}`,
        {
          method: "PUT",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        // Handle successful update
        console.log("Book details updated successfully");
        // Close the modal or handle any other UI updates
        setShowUpdateModal(false);
        setUpdatedName("");
        setUpdatedBookCategory("");
        setUpdatedBookPrice("");
        setUpdatedTotalPages("");
        setUpdatedSelfNo("");
        setUpdatedImage(""); // Set to an empty string or null, depending on your server-side handling
        setSelectedLibrary(null);
        setShowUpdateAlert(true);
      } else {
        // Handle errors
        console.error("Failed to update book details");
        setShowUpdateAlert(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteClick = (books) => {
    setSelectedLibrary(books);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteClose = () => {
    setSelectedLibrary(null);
    setShowDeleteConfirmation(false);
  };
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleDelete = async (bookId) => {
    try {
      if (!selectedLibrary) {
        console.error("No books selected for deletion");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/library/books/${bookId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setShowDeleteAlert(true);
        setShowDeleteConfirmation(false);
      } else {
        setShowDeleteAlert(false);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />
      <Navbar />
      <div className="viewTable" style={{ paddingTop: "60px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="ml-auto">
            <input
              type="text"
              className="form-control form-control-sl border-black text-black"
              placeholder="Search by section name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-end mb-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddLibraryClick}
            >
              Add Book
            </button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">S/N</th>
              <th scope="col">
                <i class="fa-solid fa-user"></i> Image
              </th>
              <th scope="col">
                <i class="fa-solid fa-user"></i> Book name
              </th>
              <th scope="col">
                <i class="fa-regular fa-envelope"></i> Category
              </th>
              <th scope="col">
                <i class="fa-solid fa-gear"></i> Price
              </th>
              <th scope="col">
                <i class="fa-solid fa-gear"></i> Total pages
              </th>
              <th scope="col">
                <i class="fa-solid fa-gear"></i> Self No.
              </th>
              <th scope="col">
                <i class="fa-solid fa-gear"></i> Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLibrary.map((library, index) => (
              <tr key={library._id}>
                <th scope="row">{index + 1}</th>
                <td>
                  <img
                    src={library.image}
                    alt={library.bookName}
                    width="100"
                    height="150"
                  />
                </td>
                <td>{library.bookName}</td>
                <td>{library.bookCategory}</td>
                <td>{library.bookPrice}</td>
                <td>{library.totalPages}</td>
                <td>{library.selfNo}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() => handleView(library)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdateClick(library)}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={() => handleDeleteClick(library)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showDeleteAlert && (
          <div className="alert alert-success" role="alert">
            Book deleted successfully!
          </div>
        )}

        {showUpdateAlert && (
          <div className="alert alert-success" role="alert">
            Book's details updated successfully!
          </div>
        )}
        {alertMessage && (
          <div className="alert alert-success" role="alert">
            Book added successfully!
          </div>
        )}
        <Modal show={showDeleteConfirmation} onHide={handleDeleteClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this book?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(selectedLibrary?._id)}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUpdateModal} onHide={handleUpdateClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Book's Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateSubmit}>
              <Form.Group controlId="formUpdateName">
                <Form.Label>Book Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter updated name"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formUpdateBookCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter updated category"
                  value={updatedBookCategory}
                  onChange={(e) => setUpdatedBookCategory(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formUpdateBookPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter updated price"
                  value={updatedBookPrice}
                  onChange={(e) => setUpdatedBookPrice(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formUpdateTotalPages">
                <Form.Label>Total pages</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter updated pages"
                  value={updatedTotalPages}
                  onChange={(e) => setUpdatedTotalPages(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formUpdateSelfNo">
                <Form.Label>Self No.</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter updated self no."
                  value={updatedSelfNo}
                  onChange={(e) => setUpdatedSelfNo(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formUpdateImage">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  placeholder="Choose updating image"
                  onChange={(e) => setUpdatedImage(e.target.files[0])}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Update
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleUpdateClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showLibraryDetailsModal}
          onHide={handleCloseLibraryDetails}
        >
          <Modal.Header closeButton>
            <Modal.Title>Books Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={selectedLibrary?.image} height={100} width={150} />
            <p>Book Name: {selectedLibrary?.bookName}</p>
            <p>Book Category: {selectedLibrary?.bookCategory}</p>
            <p>Book Price: {selectedLibrary?.bookPrice}</p>
            <p>Total Pages: {selectedLibrary?.totalPages}</p>
            <p>Self No.: {selectedLibrary?.selfNo}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseLibraryDetails}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showAddLibraryModal} onHide={handleAddLibraryClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label>Book name</label>
              <input
                type="text"
                name="bookName"
                className="form-control"
                placeholder="Enter book name"
                value={formData.bookName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Book Category</label>
              <input
                type="text"
                name="bookCategory"
                className="form-control"
                placeholder="Enter book category "
                value={formData.bookCategory}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Book Price</label>
              <input
                type="number"
                name="bookPrice"
                className="form-control"
                placeholder="Enter book price "
                value={formData.bookPrice}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Total Pages</label>
              <input
                type="text"
                name="totalPages"
                className="form-control"
                placeholder="Enter total pages "
                value={formData.totalPages}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Self No.</label>
              <input
                type="text"
                name="selfNo"
                className="form-control"
                placeholder="Enter book category "
                value={formData.selfNo}
                onChange={handleInputChange}
                required
              />
              <div className="mb-3">
                <label>Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddLibraryClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddLibrarySubmit}>
              Add Book
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ViewLibrary;
