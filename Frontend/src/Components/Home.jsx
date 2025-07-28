import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth(); // Destructure isAdmin
  const navigate = useNavigate();

  // Function to handle clicking on an explore link from Home page
  const handleExploreLinkClick = (e, linkTo, requiresAuth = false) => {
    if (requiresAuth && !isAuthenticated) {
      e.preventDefault();
      // Assuming you will pass a showNotification method in props or context if needed
      navigate("/ulogin");
    } else {
      navigate(linkTo);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 text-center">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-full max-w-4xl">
        <h1 className="text-5xl font-extrabold text-green-400 mb-6 leading-tight">
          Welcome to Agri-Tech
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Empowering farmers with smart solutions for a sustainable future.
        </p>
        {!isAuthenticated ? (
          // When NOT authenticated: Show Login/Signup buttons
          <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
            <Link
              to="/ulogin"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-200 transform hover:scale-105 text-lg"
            >
              User Login
            </Link>
            <Link
              to="/usignup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-200 transform hover:scale-105 text-lg"
            >
              User Sign Up
            </Link>
            <Link
              to="/alogin"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-200 transform hover:scale-105 text-lg"
            >
              Admin Login
            </Link>
          </div>
        ) : (
          // When IS authenticated: Show a welcome message and a link to their dashboard
          <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center items-center">
            <p className="text-xl text-gray-300">
              You are logged in as{" "}
              <span className="font-semibold capitalize">{user?.role}</span>:{" "}
              <span className="font-semibold">{user?.name}</span>
            </p>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-200 transform hover:scale-105 text-lg"
            >
              Logout
            </button>
          </div>
        )}

        {/* Show "Explore our services" ONLY when NOT authenticated */}
        {!isAuthenticated && (
          <div className="mt-12 text-gray-400 text-lg">
            <p className="mb-2">Explore our services:</p>
            <div className="flex justify-center space-x-6 flex-wrap">
              <HomeExploreLink
                to="/aboutus"
                isAuthenticated={isAuthenticated}
                onClick={(e) => handleExploreLinkClick(e, "/aboutus", false)}
                showLoginRequiredText={false}
              >
                About Us
              </HomeExploreLink>
              <HomeExploreLink
                to="/unav"
                isAuthenticated={isAuthenticated}
                onClick={(e) => handleExploreLinkClick(e, "/unav", false)}
                showLoginRequiredText={false}
              >
                Services
              </HomeExploreLink>
              <HomeExploreLink
                to="/uproducts"
                isAuthenticated={isAuthenticated}
                onClick={(e) => handleExploreLinkClick(e, "/uproducts", true)}
                showLoginRequiredText={false}
              >
                Products
              </HomeExploreLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for Home page's explore links
const HomeExploreLink = ({
  to,
  children,
  isAuthenticated,
  onClick,
  showLoginRequiredText = false,
}) => {
  const classes = `hover:text-green-400 transition duration-200 py-2 px-3 rounded-md text-sm font-medium
                   ${
                     !isAuthenticated && to === "/uproducts"
                       ? "opacity-50 cursor-not-allowed"
                       : "cursor-pointer"
                   }`;

  return (
    <div
      onClick={onClick}
      className={classes}
      role="link"
      aria-disabled={!isAuthenticated && to === "/uproducts"}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(e);
        }
      }}
    >
      {children}
      {showLoginRequiredText && !isAuthenticated && (
        <span className="block text-yellow-400 text-xs mt-2 font-bold">
          Login Req.
        </span>
      )}
    </div>
  );
};

export default Home;
