import React, { useEffect, useState } from "react";
import api from "../services/api"; // Import your api service
import { useParams, useNavigate } from "react-router-dom";

const UserEdit = ({ showNotification }) => {
  const { id } = useParams(); // Get user ID from URL
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Only set if changing password
  const [role, setRole] = useState("user"); // New state for user role

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Use api.get for authenticated requests
        const response = await api.get(`/admin/users/${id}`); // Fetch user by ID
        const userData = response.data;
        setName(userData.name);
        setEmail(userData.email);
        setRole(userData.role || "user"); // Set existing role, default to 'user'
      } catch (err) {
        console.error("Error fetching user for edit:", err);
        showNotification(
          err.response?.data?.message || "Failed to load user data.",
          "error"
        );
        navigate("/users"); // Redirect if user not found or error
      }
    };
    fetchUser();
  }, [id, navigate, showNotification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = { name, email, role };
      if (password) {
        // Only include password if it's being changed
        updateData.password = password;
      }
      // Use api.put for authenticated requests
      const response = await api.put(`/admin/users/${id}`, updateData); // Update user
      showNotification(
        response.data.message || "User updated successfully!",
        "success"
      );
      navigate("/users"); // Navigate back to user list after updating
    } catch (err) {
      console.error("Error updating user:", err);
      showNotification(
        err.response?.data?.message || "Failed to update user.",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Edit User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Name:
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
              htmlFor="email"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              New Password (optional):
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Role:
            </label>
            <input
              type="text"
              id="role"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              placeholder="Enter role (e.g., user or admin)"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-200"
          >
            Update User
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;
