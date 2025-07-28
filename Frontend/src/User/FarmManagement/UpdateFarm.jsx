import React, { useEffect, useState } from "react";
import api from "../../services/api"; // Correct path to api service
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Correct path to AuthContext
import moment from "moment"; // For date formatting

const UpdateFarm = ({ showNotification }) => {
  const { id } = useParams(); // Get farm ID from URL
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth(); // Get authenticated user

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [areaSize, setAreaSize] = useState("");
  const [cropType, setCropType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarm = async () => {
      if (authLoading || !isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Fetch specific farm by ID
        const response = await api.get(`/farms/${id}`);
        const farmData = response.data;

        // Basic authorization check on frontend (backend also enforces)
        if (farmData.userId !== user.id && user.role !== "admin") {
          showNotification("Not authorized to view/edit this farm.", "error");
          navigate("/getfarms"); // Redirect if not authorized
          return;
        }

        setName(farmData.name);
        setLocation(farmData.location);
        setAreaSize(farmData.areaSize);
        setCropType(farmData.cropType);
      } catch (err) {
        console.error("Error fetching farm for update:", err);
        setError(err.response?.data?.message || "Failed to load farm data.");
        showNotification(
          err.response?.data?.message || "Failed to load farm data.",
          "error"
        );
        navigate("/getfarms"); // Redirect if farm not found or error
      } finally {
        setLoading(false);
      }
    };
    fetchFarm();
  }, [id, navigate, showNotification, user, isAuthenticated, authLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showNotification("Please log in to update farms.", "warning");
      navigate("/ulogin");
      return;
    }

    try {
      // Use api.put for authenticated requests
      const response = await api.put(`/farms/${id}`, {
        name,
        location,
        areaSize: parseFloat(areaSize),
        cropType,
        // userId and userName are not typically sent on update unless they are changing
      });
      showNotification(
        response.data.message || "Farm updated successfully!",
        "success"
      );
      navigate("/getfarms"); // Navigate back to farm list
    } catch (err) {
      console.error("Error updating farm:", err);
      showNotification(
        err.response?.data?.message || "Failed to update farm.",
        "error"
      );
    }
  };

  if (authLoading) {
    return (
      <div className="text-center mt-20 text-white">
        Loading user authentication...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center mt-20 text-red-500">
        Please log in to update farms.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-20 text-white">Loading farm data...</div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Update Farm
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
              Area Size (sq. units):
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
            Update Farm
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateFarm;
