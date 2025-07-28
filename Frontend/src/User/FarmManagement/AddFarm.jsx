import React, { useState } from "react";
import api from "../../services/api"; // Correct path to api service
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Correct path to AuthContext

const AddFarm = ({ showNotification }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [areaSize, setAreaSize] = useState("");
  const [cropType, setCropType] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth(); // Get authenticated user details

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showNotification("Please log in to add farms.", "warning");
      navigate("/ulogin");
      return;
    }

    try {
      // Use api.post for authenticated requests
      const response = await api.post("/farms", {
        name,
        location,
        areaSize: parseFloat(areaSize), // Ensure areaSize is a number
        cropType,
        userId: user.id, // Pass userId from authenticated user
        userName: user.name, // Pass userName from authenticated user
      });
      showNotification(
        response.data.message || "Farm added successfully!",
        "success"
      );
      navigate("/getfarms"); // Navigate back to get farms list
    } catch (err) {
      console.error("Error adding farm:", err);
      showNotification(
        err.response?.data?.message || "Failed to add farm.",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Add New Farm
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Farm Name:
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
              htmlFor="location"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Location:
            </label>
            <input
              type="text"
              id="location"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="areaSize"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Area Size (in acres):
            </label>
            <input
              type="number"
              id="areaSize"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              value={areaSize}
              onChange={(e) => setAreaSize(e.target.value)}
              min="0"
              required
            />
          </div>
          <div>
            <label
              htmlFor="cropType"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Main Crop Type:
            </label>
            <input
              type="text"
              id="cropType"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-200"
          >
            Add Farm
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFarm;
