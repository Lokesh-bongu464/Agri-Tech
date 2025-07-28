import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import moment from "moment";
import ConfirmationDialog from "../Components/ConfirmationDialog";

const Users = ({ showNotification }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the Farms/Crops Modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Stores the full user object with farms/crops
  const [activeTab, setActiveTab] = useState("farms"); // 'farms' or 'crops'

  // State for Delete Confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/admin/users");
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        const errMsg = err.response?.data?.message || "Failed to fetch users.";
        setError(errMsg);
        showNotification(errMsg, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [showNotification]);

  // Open the delete confirmation dialog
  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  // Close the delete dialog
  const closeDeleteDialog = () => {
    setUserToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  // Confirm delete user
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/admin/users/${userToDelete._id}`);
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u._id !== userToDelete._id)
      );
      showNotification("User deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting user:", err);
      const errMsg = err.response?.data?.message || "Failed to delete user.";
      setError(errMsg);
      showNotification(errMsg, "error");
    } finally {
      closeDeleteDialog();
    }
  };

  // Open details modal
  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setActiveTab("farms");
    setIsDetailsModalOpen(true);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setSelectedUser(null);
    setIsDetailsModalOpen(false);
    setActiveTab("farms");
  };

  if (loading) {
    return <div className="text-center mt-20 text-white">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Manage Users
      </h2>

      {users.length === 0 ? (
        <p className="text-center text-gray-400">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 capitalize">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.farms.length > 0 || user.crops.length > 0 ? (
                      <button
                        onClick={() => openDetailsModal(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded-full transition duration-200"
                      >
                        View Details ({user.farms.length}F, {user.crops.length}
                        C)
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">No Data</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <Link
                      to={`/useredit/${user._id}`}
                      className="text-indigo-400 hover:text-indigo-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => openDeleteDialog(user)}
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

      {/* Details Modal (Farms & Crops) */}
      {isDetailsModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                Details for {selectedUser.name}
              </h3>
              <button
                onClick={closeDetailsModal}
                className="text-gray-400 hover:text-white text-3xl font-bold"
                aria-label="Close details modal"
              >
                &times;
              </button>
            </div>

            {/* Tabs - Farms and Crops */}
            <div className="flex border-b border-gray-700 mb-4">
              <button
                type="button"
                className={`py-2 px-4 font-semibold ${
                  activeTab === "farms"
                    ? "border-b-2 border-green-500 text-white"
                    : "text-gray-400"
                }`}
                onClick={() => setActiveTab("farms")}
                aria-selected={activeTab === "farms"}
              >
                Farms ({selectedUser.farms.length})
              </button>
              <button
                type="button"
                className={`py-2 px-4 font-semibold ${
                  activeTab === "crops"
                    ? "border-b-2 border-green-500 text-white"
                    : "text-gray-400"
                }`}
                onClick={() => setActiveTab("crops")}
                aria-selected={activeTab === "crops"}
              >
                Crops ({selectedUser.crops.length})
              </button>
            </div>

            {/* Farms tab content */}
            {activeTab === "farms" && (
              <>
                {selectedUser.farms.length === 0 ? (
                  <p className="text-gray-400">This user has no farms.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedUser.farms.map((farm) => (
                      <div
                        key={farm._id}
                        className="bg-gray-700 p-4 rounded-lg"
                      >
                        <p className="text-white text-lg font-semibold">
                          {farm.name}
                        </p>
                        <p className="text-gray-300 text-sm">
                          Location: {farm.location}
                        </p>
                        <p className="text-gray-300 text-sm">
                          Area: {farm.areaSize} sq. units
                        </p>
                        <p className="text-gray-300 text-sm">
                          Crop Type: {farm.cropType}
                        </p>
                        <p className="text-gray-300 text-xs mt-1">
                          Created:{" "}
                          {moment(farm.createdAt).format("YYYY-MM-DD HH:mm")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Crops tab content */}
            {activeTab === "crops" && (
              <>
                {selectedUser.crops.length === 0 ? (
                  <p className="text-gray-400">This user has no crops.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedUser.crops.map((crop) => (
                      <div
                        key={crop._id}
                        className="bg-gray-700 p-4 rounded-lg flex flex-col md:flex-row items-center gap-4"
                      >
                        {crop.imgUrl && (
                          <img
                            src={crop.imgUrl}
                            alt={crop.name}
                            className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                            onError={(e) =>
                              (e.target.src =
                                "https://placehold.co/100x100/cccccc/ffffff?text=No+Img")
                            }
                          />
                        )}
                        <div>
                          <p className="text-white text-lg font-semibold">
                            {crop.name} {crop.variety && `(${crop.variety})`}
                          </p>
                          <p className="text-gray-300 text-sm">
                            Quantity: {crop.quantity}
                          </p>
                          <p className="text-gray-300 text-sm">
                            Planted:{" "}
                            {moment(crop.plantedDate).format("YYYY-MM-DD")}
                          </p>
                          <p className="text-gray-300 text-sm">
                            Est. Harvest:{" "}
                            {moment(crop.estimatedHarvestDate).format(
                              "YYYY-MM-DD"
                            )}
                          </p>
                          <p className="text-gray-300 text-xs mt-1">
                            Created:{" "}
                            {moment(crop.createdAt).format("YYYY-MM-DD HH:mm")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog for deleting user */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title="Delete User"
        message={`Are you sure you want to delete user "${userToDelete?.name}"? This action cannot be undone.`}
        onConfirm={confirmDeleteUser}
        onCancel={closeDeleteDialog}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Users;
