import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const CropsDetails = ({ showNotification }) => {
  const [cropsData, setCropsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCropsData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch crop info list from MongoDB-backed API
        const response = await api.get("/cropinfos");
        setCropsData(response.data);
      } catch (err) {
        console.error("Error fetching crop info:", err);
        const message =
          err.response?.data?.message || "Failed to fetch crop details.";
        setError(message);
        showNotification(message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchCropsData();
  }, [showNotification]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-white">Loading crop info...</div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Crop Information
      </h2>
      {cropsData.length === 0 ? (
        <p className="text-center text-gray-400">No crop info available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cropsData.map((crop) => (
            <div
              key={crop._id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              <img
                src={crop.imgUrl}
                alt={crop.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/600x400/cccccc/ffffff?text=No+Image";
                }}
              />
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {crop.name}
                </h3>
                <p className="text-gray-400 text-sm mb-1">
                  Scientific Name: {crop.scientificName || "-"}
                </p>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  Season: {crop.season || "-"}
                </p>
              </div>
              <div className="p-4 border-t border-gray-700">
                <Link
                  to={`/cropinfo/${crop._id}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropsDetails;
