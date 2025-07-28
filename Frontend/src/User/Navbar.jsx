import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-white text-2xl font-bold hover:text-green-400 transition duration-200"
        >
          Agri-Tech
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          {/* Public Links */}
          <NavLink to="/">Home</NavLink>
          <NavLink to="/aboutus">About Us</NavLink>

          {/* Conditional Links */}
          {!isAuthenticated ? (
            <>
              <NavLink to="/uproducts">Products</NavLink>
              <NavLink to="/cropsdetails">Crop Info</NavLink>
              <NavLink to="/weather">Weather</NavLink>
              <NavLink to="/unav">Services</NavLink>
              <NavLink to="/ulogin">User Login</NavLink>
              <NavLink to="/alogin">Admin Login</NavLink>
            </>
          ) : (
            <>
              {user?.role === "user" && (
                <>
                  <NavLink to="/uhome">User Dashboard</NavLink>
                  <NavLink to="/uproducts">Products</NavLink>
                  <NavLink to="/cropsdetails">Crop Info</NavLink>
                  <NavLink to="/weather">Weather</NavLink>
                  <NavLink to="/unav">Services</NavLink>
                  <NavLink to="/mybookings">My Orders</NavLink>
                  <NavLink to="/getcrops">My Crops</NavLink>
                  <NavLink to="/getfarms">My Farms</NavLink>
                </>
              )}
              {user?.role === "admin" && (
                <>
                  <NavLink to="/ahome">Admin Dashboard</NavLink>
                  <NavLink to="/getproducts">Manage Products</NavLink>
                  <NavLink to="/users">Manage Users</NavLink>
                  <NavLink to="/cropsdetails">Crop Info</NavLink>
                  <NavLink to="/admin/cropinfos">Manage Crop Info</NavLink>
                  <NavLink to="/weather">Weather</NavLink>
                </>
              )}
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Logout ({user?.name})
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button (toggle logic not included) */}
        <div className="md:hidden">
          <button
            className="text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

// Helper component for consistent NavLink styling
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
  >
    {children}
  </Link>
);

export default Navbar;
