import React, { useState } from "react";
import api from "../services/api"; // Import your api service
import { useNavigate } from "react-router-dom";

const AddProduct = ({ showNotification }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use api.post for authenticated requests
      const response = await api.post("/admin/products", {
        name,
        category,
        price: parseFloat(price), // Ensure price is a number
        description,
        imgUrl,
      });
      showNotification(
        response.data.message || "Product added successfully!",
        "success"
      );
      navigate("/getproducts"); // Navigate back to product list after adding
    } catch (err) {
      console.error("Error adding product:", err);
      showNotification(
        err.response?.data?.message || "Failed to add product.",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Product Name:
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Category:
            </label>
            <input
              type="text"
              id="category"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Price:
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-lg font-semibold select-none">
                ₹
              </span>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                className="pl-8 shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Description:
            </label>
            <textarea
              id="description"
              rows="3"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="imgUrl"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Image URL:
            </label>
            <input
              type="url"
              id="imgUrl"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-200"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
