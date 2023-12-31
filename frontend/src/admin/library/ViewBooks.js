import React, { useEffect, useState } from "react";
import axios from "axios";
import "./adminCss.css";
const ViewBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/library/books")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  return (
    <div>
      <h1>Books</h1>
      <table>
        <th>Image</th>
        <th>Book name</th>
        <th>Category</th>
        <th>Price</th>
        <th>Total pages</th>
        <th>Self number</th>
        <th>Operations</th>
        {books.map((book) => (
          <tr key={book._id}>
            <td>
              {" "}
              <img
                src={book.image}
                alt={book.bookName}
                width="100"
                height="150"
              />
            </td>
            <td> {book.bookName}</td>
            <td>{book.bookCategory}</td>
            <td>{book.bookPrice}</td>
            <td>{book.totalPages}</td>
            <td>{book.selfNo}</td>
            <td>
              <button>View</button>
              <button>Update</button>
              <button>Delete</button>
            </td>
          </tr>
        ))}{" "}
      </table>

      <a href="/admin/addBooks">
        <button>Add new book</button>
      </a>
    </div>
  );
};

export default ViewBooks;
