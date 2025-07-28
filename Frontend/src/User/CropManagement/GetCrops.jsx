import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import ConfirmationDialog from "../../Components/ConfirmationDialog"; // ← Correct path

const GetCrops = ({ showNotification }) => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cropToDelete, setCropToDelete] = useState(null);

  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCrops = async () => {
      if (authLoading || !isAuthenticated || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/crops/user/${user.id}`);
        setCrops(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch crops.");
        showNotification(
          err.response?.data?.message || "Failed to fetch crops.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, [user, isAuthenticated, authLoading, showNotification]);

  // Handler to open the dialog, storing which crop to delete
  const onDeleteClick = (id) => {
    setCropToDelete(id);
    setIsDialogOpen(true);
  };

  // Run when user confirms in dialog
  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/crops/${cropToDelete}`);
      setCrops(crops.filter((crop) => crop._id !== cropToDelete));
      showNotification("Crop deleted successfully!", "success");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete crop.");
      showNotification(
        err.response?.data?.message || "Failed to delete crop.",
        "error"
      );
    } finally {
      setIsDialogOpen(false);
      setCropToDelete(null);
    }
  };

  // Run when user cancels or closes dialog
  const handleDeleteCancelled = () => {
    setIsDialogOpen(false);
    setCropToDelete(null);
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
        Please log in to view your crops.
      </div>
    );
  }
  if (loading) {
    return (
      <div className="text-center mt-20 text-white">Loading your crops...</div>
    );
  }
  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        My Crops
      </h2>

      {/* Add New Crop Button */}
      <div className="flex justify-end mb-4">
        <Link
          to="/addcrop"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Add New Crop
        </Link>
      </div>

      {/* Table of Crops */}
      {crops.length === 0 ? (
        <p className="text-center text-gray-400">No crops found. Add some!</p>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Variety
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Planted Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Estimated Harvest Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {crops.map((crop) => (
                <tr key={crop._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {crop.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {crop.variety}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {crop.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {crop.plantedDate
                      ? moment(crop.plantedDate).format("YYYY-MM-DD")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {crop.estimatedHarvestDate
                      ? moment(crop.estimatedHarvestDate).format("YYYY-MM-DD")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/updatecrop/${crop._id}`}
                      className="text-indigo-400 hover:text-indigo-600 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDeleteClick(crop._id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this crop?"
        onConfirm={handleDeleteConfirmed}
        onCancel={handleDeleteCancelled}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default GetCrops;
