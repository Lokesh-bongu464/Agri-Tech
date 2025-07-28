import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const CropInfoDetails = ({ showNotification }) => {
  const { id } = useParams();
  const [cropInfo, setCropInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCropInfo = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/cropinfos/${id}`);
        setCropInfo(response.data);
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to fetch crop info.";
        setError(message);
        showNotification(message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCropInfo();
  }, [id, showNotification]);

  if (loading)
    return (
      <div className="text-center mt-20 text-white">Loading crop info...</div>
    );
  if (error)
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  if (!cropInfo)
    return (
      <div className="text-center mt-20 text-gray-400">
        Crop info not found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded shadow-lg text-white">
      <h1 className="text-3xl font-bold mb-4">{cropInfo.name}</h1>
      {cropInfo.imgUrl && (
        <img
          src={cropInfo.imgUrl}
          alt={cropInfo.name}
          className="w-full max-h-96 object-cover rounded mb-6"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x400/cccccc/ffffff?text=No+Image";
          }}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <p>
          <strong>Scientific Name:</strong> {cropInfo.scientificName || "-"}
        </p>
        <p>
          <strong>Season:</strong> {cropInfo.season || "-"}
        </p>
        <p>
          <strong>Temperature Range:</strong> {cropInfo.temperatureRange || "-"}
        </p>
        <p>
          <strong>Rainfall Range:</strong> {cropInfo.rainfallRange || "-"}
        </p>
        <p>
          <strong>Soil Type:</strong> {cropInfo.soilType || "-"}
        </p>
        <p>
          <strong>Sowing Time:</strong> {cropInfo.sowingTime || "-"}
        </p>
        <p>
          <strong>Harvest Time:</strong> {cropInfo.harvestTime || "-"}
        </p>
        <p>
          <strong>Duration:</strong> {cropInfo.duration || "-"}
        </p>
        <p>
          <strong>Pesticides:</strong>{" "}
          {cropInfo.pesticides?.length > 0
            ? cropInfo.pesticides.join(", ")
            : "-"}
        </p>
        <p>
          <strong>Fertilizers:</strong>{" "}
          {cropInfo.fertilizers?.length > 0
            ? cropInfo.fertilizers.join(", ")
            : "-"}
        </p>
      </div>
      <div className="mt-6">
        <Link
          to="/cropsdetails"
          className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded text-white font-semibold"
        >
          Back to Crop Info List
        </Link>
      </div>
    </div>
  );
};

export default CropInfoDetails;
