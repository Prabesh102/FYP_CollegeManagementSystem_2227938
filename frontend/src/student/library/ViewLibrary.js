import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";
import profile from "../../image/profile.png";

const ViewLibrary = () => {
  const [library, setLibrary] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/library/books")
      .then((response) => {
        setLibrary(response.data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = library.slice(indexOfFirstBook, indexOfLastBook);

  const handleViewMore = () => {
    setCurrentPage(currentPage + 1);
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
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: "16px" }}>
          <nav className="navbar navbar-light">
            <div className="d-flex align-items-center">
              <form className="form-inline d-flex">
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button
                  className="btn btn-outline-success my-2 my-sm-0"
                  type="submit"
                >
                  Search
                </button>
              </form>
            </div>
          </nav>
          <div
            className="col-md-3 d-flex justify-content-end p-4"
            style={{ position: "absolute", right: "0", top: "0" }}
          >
            <div className="ml-2 d-flex flex-column">
              <div className="ml-2 d-flex">
                <img
                  src={profile}
                  alt=""
                  style={{
                    height: "40px",
                    width: "40px",
                    marginRight: "3px",
                  }}
                />
                <div className="ml-2 d-flex">
                  <div className="context-texts">
                    {" "}
                    <h5>Username</h5>
                    <p>Semester/year</p>{" "}
                  </div>
                  <i
                    className="fa-solid fa-bell fa-2x p-3"
                    style={{ marginLeft: "5px" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
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
                  {/* <p>{book.bookCategory}</p> */}
                  {/* <p>{book.bookPrice}</p>
                  <p>{book.totalPages}</p>
                  <p>{book.selfNo}</p> */}
                  <button
                    type="button"
                    class="btn btn-primary"
                    style={{ marginLeft: "7px", backgroundColor: "#925fe2" }}
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
                    //   justifyContent: "center",
                    //   textAlign: "center",
                    //   alignItems: "center",
                  }}
                  onClick={handleViewMore}
                >
                  View More
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewLibrary;
