import React, { useEffect, useState } from "react";
import axios from "axios";
import "./adminCss.css";

const ViewFood = () => {
  const [foods, setFood] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/canteen/foods")
      .then((response) => {
        setFood(response.data);
      })
      .catch((error) => console.error("Error fetching foods:", error));
  }, []);
  return (
    <div>
      <h1>Foods: </h1>
      <table>
        <th>Food Name</th>
        <th>Food Quantity</th>
        <th>Food Price</th>
        {foods.map((food) => (
          <tr key={food._id}>
            <td>{food.foodName}</td>
            <td>{food.price}</td>
            <td>{food.quantity}</td>
            <td>
              <button>View</button>
              <button>Update</button>
              <button>Delete</button>
            </td>
          </tr>
        ))}
      </table>
      <a href="/admin/addFood">
        <button>Add new food</button>
      </a>
    </div>
  );
};

export default ViewFood;
