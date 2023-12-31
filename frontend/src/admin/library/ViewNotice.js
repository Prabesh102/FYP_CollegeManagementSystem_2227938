import React, { useEffect, useState } from "react";
import axios from "axios";
import "./adminCss.css";
const ViewNotice = () => {
  const [notices, setNotice] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/library/notice")
      .then((response) => {
        setNotice(response.data);
      })
      .catch((error) => console.error("Error fetching notice:", error));
  }, []);
  return (
    <div>
      <h1>Notice: </h1>
      <table>
        <th>Notice Title</th>
        <th>Notice Description</th>
        {notices.map((notice) => (
          <tr key={notice._id}>
            <td>{notice.noticeTitle}</td>
            <td>{notice.noticeDescription}</td>
            <td>
              <button>View</button>
              <button>Update</button>
              <button>Delete</button>
            </td>
          </tr>
        ))}
      </table>
      <a href="/admin/addNotice">
        <button>Add new notice</button>
      </a>
    </div>
  );
};

export default ViewNotice;
