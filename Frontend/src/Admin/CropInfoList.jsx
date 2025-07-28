import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import ConfirmationDialog from "../Components/ConfirmationDialog";

const CropInfoList = ({ showNotification }) => {
  const [cropInfos, setCropInfos] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for confirmation dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState(null);

  useEffect(() => {
    const fetchCropInfos = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/cropinfos");
        setCropInfos(data);
      } catch (error) {
        showNotification("Failed to load Crop Info data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCropInfos();
  }, [showNotification]);

  const openDeleteDialog = (id) => {
    setSelectedCropId(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSelectedCropId(null);
    setDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCropId) return;
    try {
      await api.delete(`/cropinfos/${selectedCropId}`);
      setCropInfos((prev) => prev.filter((c) => c._id !== selectedCropId));
      showNotification("Crop Info deleted successfully.", "success");
    } catch {
      showNotification("Failed to delete Crop Info.", "error");
    }
    closeDeleteDialog();
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-white">
        Loading Crop Info data...
      </div>
    );

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-white">Manage Crop Info</h1>
      <div className="mb-4">
        <Link
          to="/admin/cropinfos/add"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Add New Crop Info
        </Link>
      </div>
      {cropInfos.length === 0 ? (
        <p className="text-gray-400 text-center">No Crop Info available.</p>
      ) : (
        <table className="table-auto w-full bg-gray-900 rounded shadow overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Scientific Name</th>
              <th className="px-4 py-2 text-left">Season</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 text-white">
            {cropInfos.map((crop) => (
              <tr key={crop._id}>
                <td className="px-4 py-2">{crop.name}</td>
                <td className="px-4 py-2">{crop.scientificName || "-"}</td>
                <td className="px-4 py-2">{crop.season || "-"}</td>
                <td className="px-4 py-2">
                  <Link
                    to={`/admin/cropinfos/edit/${crop._id}`}
                    className="text-blue-400 hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => openDeleteDialog(crop._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmationDialog
        isOpen={dialogOpen}
        title="Delete Crop Info"
        message="Are you sure you want to delete this Crop Info? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteDialog}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default CropInfoList;
