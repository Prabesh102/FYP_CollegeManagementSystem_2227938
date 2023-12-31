import React, { useEffect, useState } from "react";
import axios from "axios";
import "./adminCss.css";
const AddFood = () => {
  const [formData, setFormData] = useState({
    foodName: "",
    price: "",
    quantity: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("foodName", formData.foodName);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("quantity", formData.quantity);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/canteen/foods",
        formDataToSend
      );
      console.log("Food added:", response.data);

      setFormData({
        foodName: "",
        price: "",
        quantity: "",
      });
    } catch (error) {
      console.error("Error creating food:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Food name</label>
        <input
          type="text"
          name="foodName"
          value={formData.foodName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Quantity</label>
        <input
          type="text"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
        />
      </div>

      <button type="submit">Add food</button>
    </form>
  );
};

export default AddFood;
