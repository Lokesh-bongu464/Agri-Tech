import React, { useEffect, useState } from "react"; // <-- CORRECTED LINE
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const ViewCropData = ({ showNotification }) => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCropData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/crops/data/${name}`);
        setCrop(response.data);
      } catch (err) {
        console.error("Error fetching static crop data by name:", err);
        setError(err.response?.data?.message || "Failed to fetch crop data.");
        showNotification(
          err.response?.data?.message || "Failed to fetch crop data.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCropData();
  }, [name, navigate, showNotification]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-white">
        Loading crop details...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  if (!crop) {
    return (
      <div className="text-center mt-20 text-gray-400">
        Crop data not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {crop.name} Details
        </h2>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="md:w-1/2 flex justify-center">
            <img
              src={crop.imgUrl}
              alt={crop.name}
              className="w-full max-w-xs md:max-w-full h-auto object-cover rounded-lg"
              onError={(e) =>
                (e.target.src =
                  "https://placehold.co/600x400/cccccc/ffffff?text=No+Image")
              }
            />
          </div>
          <div className="md:w-1/2 text-gray-300">
            <p className="mb-2">
              <strong className="text-white">Scientific Name:</strong>{" "}
              {crop.scientificName}
            </p>
            <p className="mb-2">
              <strong className="text-white">Season:</strong> {crop.season}
            </p>
            <p className="mb-2">
              <strong className="text-white">Temperature Range:</strong>{" "}
              {crop.temperatureRange}
            </p>
            <p className="mb-2">
              <strong className="text-white">Rainfall Range:</strong>{" "}
              {crop.rainfallRange}
            </p>
            <p className="mb-2">
              <strong className="text-white">Soil Type:</strong> {crop.soilType}
            </p>
            <p className="mb-2">
              <strong className="text-white">Sowing Time:</strong>{" "}
              {crop.sowingTime}
            </p>
            <p className="mb-2">
              <strong className="text-white">Harvest Time:</strong>{" "}
              {crop.harvestTime}
            </p>
            <p className="mb-2">
              <strong className="text-white">Duration:</strong> {crop.duration}
            </p>
            <p className="mb-2">
              <strong className="text-white">Pesticides:</strong>{" "}
              {crop.pesticides ? crop.pesticides.join(", ") : "N/A"}
            </p>
            <p className="mb-2">
              <strong className="text-white">Fertilizers:</strong>{" "}
              {crop.fertilizers ? crop.fertilizers.join(", ") : "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/cropsdetails")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Back to All Crops
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCropData;
