import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Uservices = ({ showNotification }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Function to handle clicking on ANY service card
  const handleServiceCardClick = (e, linkTo) => {
    if (!isAuthenticated) {
      e.preventDefault(); // Prevent default Link navigation
      showNotification("Please log in to access this service.", "warning");
      navigate("/ulogin"); // Redirect to login
    } else {
      navigate(linkTo); // Proceed if authenticated
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Our Services</h2>
        <p className="text-lg text-gray-300 mb-8">
          Explore the range of services we offer to empower farmers and
          agricultural businesses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard
            title="Product Marketplace"
            description="Buy and sell agricultural products and equipment easily."
            link="/uproducts"
            icon="🛒"
            isAuthenticated={isAuthenticated} // Pass for visual styling
            onClick={handleServiceCardClick} // All cards use this handler
          />
          <ServiceCard
            title="Crop Management"
            description="Track and manage your crops from planting to harvest."
            link="/getcrops"
            icon="🌾"
            isAuthenticated={isAuthenticated}
            onClick={handleServiceCardClick} // All cards use this handler
          />
          <ServiceCard
            title="Farm Management"
            description="Organize and optimize your farm operations."
            link="/getfarms"
            icon="🚜"
            isAuthenticated={isAuthenticated}
            onClick={handleServiceCardClick} // All cards use this handler
          />
          <ServiceCard
            title="Weather Forecasts"
            description="Stay updated with accurate weather predictions for your farm."
            link="/weather"
            icon="☀️"
            isAuthenticated={isAuthenticated}
            onClick={handleServiceCardClick} // All cards use this handler
          />
          <ServiceCard
            title="Crop Information"
            description="Access detailed information about various crops."
            link="/cropsdetails"
            icon="📚"
            isAuthenticated={isAuthenticated}
            onClick={handleServiceCardClick} // All cards use this handler
          />
          <ServiceCard
            title="My Bookings"
            description="View and manage all your product orders."
            link="/mybookings"
            icon="🗓️"
            isAuthenticated={isAuthenticated}
            onClick={handleServiceCardClick} // All cards use this handler
          />
        </div>
      </div>
    </div>
  );
};

// Reusable ServiceCard component - adapted to disable/redirect ALL cards if not authenticated
const ServiceCard = ({
  title,
  description,
  link,
  icon,
  isAuthenticated,
  onClick,
}) => {
  const classes = `block bg-gray-700 p-6 rounded-lg shadow-md transition duration-200 transform text-left cursor-pointer
                   ${
                     !isAuthenticated
                       ? "opacity-50 cursor-not-allowed"
                       : "hover:bg-gray-600 hover:scale-105"
                   }`;

  return (
    <div
      onClick={(e) => onClick(e, link)} // Pass the event and link
      className={classes}
      role="button" // Indicate it's clickable
      aria-disabled={!isAuthenticated} // For accessibility
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
      {!isAuthenticated && (
        <p className="text-yellow-400 text-xs mt-2 font-bold">Login Required</p>
      )}
    </div>
  );
};

export default Uservices;
