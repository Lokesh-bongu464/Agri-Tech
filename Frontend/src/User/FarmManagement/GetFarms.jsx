import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import ConfirmationDialog from "../../Components/ConfirmationDialog"; // adjust path as needed

const GetFarms = ({ showNotification }) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState(null);

  useEffect(() => {
    const fetchFarms = async () => {
      if (authLoading || !isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/farms/user/${user.id}`);
        setFarms(response.data);
      } catch (err) {
        console.error("Error fetching farms:", err);
        setError(err.response?.data?.message || "Failed to fetch farms.");
        showNotification(
          err.response?.data?.message || "Failed to fetch farms.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [user, isAuthenticated, authLoading, showNotification]);

  const openDeleteDialog = (id) => {
    setFarmToDelete(id);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/farms/${farmToDelete}`);
      setFarms(farms.filter((farm) => farm._id !== farmToDelete));
      showNotification("Farm deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting farm:", err);
      setError(err.response?.data?.message || "Failed to delete farm.");
      showNotification(
        err.response?.data?.message || "Failed to delete farm.",
        "error"
      );
    } finally {
      setIsDialogOpen(false);
      setFarmToDelete(null);
    }
  };

  const handleDeleteCancelled = () => {
    setIsDialogOpen(false);
    setFarmToDelete(null);
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
        Please log in to view your farms.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-20 text-white">Loading your farms...</div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        My Farms
      </h2>
      <div className="flex justify-end mb-4">
        <Link
          to="/addfarm"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Add New Farm
        </Link>
      </div>
      {farms.length === 0 ? (
        <p className="text-center text-gray-400">No farms found. Add some!</p>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
          {/* Added table-fixed for fixed layout */}
          <table className="min-w-full divide-y divide-gray-700 table-fixed text-gray-200">
            <thead className="bg-gray-700">
              <tr>
                <th className="w-48 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="w-48 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Location
                </th>
                <th className="w-32 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Area Size
                </th>
                <th className="w-32 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Crop Type
                </th>
                <th className="w-32 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Created At
                </th>
                <th className="w-32 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {farms.map((farm) => (
                <tr key={farm._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {farm.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {farm.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {farm.areaSize} (Acre)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {farm.cropType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {moment(farm.createdAt).format("YYYY-MM-DD")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="inline-flex space-x-4">
                      <Link
                        to={`/updatefarm/${farm._id}`}
                        className="text-indigo-400 hover:text-indigo-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => openDeleteDialog(farm._id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this farm?"
        onConfirm={handleDeleteConfirmed}
        onCancel={handleDeleteCancelled}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default GetFarms;
