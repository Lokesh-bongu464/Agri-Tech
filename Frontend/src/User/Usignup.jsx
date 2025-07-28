import React, { useState } from "react";
// import axios from 'axios'; // No longer needed, use api service
// import { useNavigate } from 'react-router-dom'; // Already imported, but ensure it's there
import api from "../services/api"; // Import api service directly for signup (no auth context needed yet)
import { Link, useNavigate } from "react-router-dom";

const Usignup = ({ showNotification }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/register", {
        name,
        email,
        password,
      });
      showNotification(
        response.data.message || "Account created successfully!",
        "success"
      );
      navigate("/ulogin"); // Redirect to login after successful signup
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Signup failed. Please try again.",
        "error"
      );
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          User Sign Up
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
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/ulogin"
            className="text-green-400 hover:text-green-500 font-bold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Usignup;
