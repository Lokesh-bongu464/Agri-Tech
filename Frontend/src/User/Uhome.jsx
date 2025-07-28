import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Uhome = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center mt-20 text-white">Loading user data...</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Welcome, {isAuthenticated && user ? user.name : "Guest"}!
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Your central hub for Agri-Tech services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/uproducts"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
          >
            <span className="block text-2xl mb-2">🛒</span>
            Browse Products
          </Link>
          <Link
            to="/mybookings"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
          >
            <span className="block text-2xl mb-2">🗓️</span>
            My Orders
          </Link>
          <Link
            to="/getcrops"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
          >
            <span className="block text-2xl mb-2">🌾</span>
            Manage My Crops
          </Link>
          <Link
            to="/getfarms"
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
          >
            <span className="block text-2xl mb-2">🚜</span>
            Manage My Farms
          </Link>
          <Link
            to="/cropsdetails" // <-- THIS LINE SHOULD HAVE NO COMMENTS AFTER IT
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
          >
            <span className="block text-2xl mb-2">📚</span>
            Static Crop Info
          </Link>
          <Link
            to="/weather"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
          >
            <span className="block text-2xl mb-2">☀️</span>
            Weather Forecast
          </Link>
        </div>

        {!isAuthenticated && (
          <p className="text-gray-400 mt-8">
            <Link to="/ulogin" className="text-green-400 hover:underline">
              Login
            </Link>{" "}
            or{" "}
            <Link to="/usignup" className="text-green-400 hover:underline">
              Sign Up
            </Link>{" "}
            to access full features.
          </p>
        )}
      </div>
    </div>
  );
};

export default Uhome;
