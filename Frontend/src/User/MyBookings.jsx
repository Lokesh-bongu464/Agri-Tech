import React, { useEffect, useState } from "react";
import api from "../services/api"; // Import your api service
import { useAuth } from "../context/AuthContext"; // Import useAuth hook
import moment from "moment"; // For date formatting

const MyBookings = ({ showNotification }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth(); // Get authenticated user

  useEffect(() => {
    const fetchBookings = async () => {
      // Wait for authentication state to load and user to be available
      if (authLoading || !isAuthenticated || !user) {
        setLoading(false); // Set loading to false if not authenticated or still loading auth
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Use api.get for authenticated requests, passing userId from context
        const response = await api.get(`/bookings/user/${user.id}`);
        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err.response?.data?.message || "Failed to fetch bookings.");
        showNotification(
          err.response?.data?.message || "Failed to fetch bookings.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, isAuthenticated, authLoading, showNotification]); // Re-run when user/auth state changes

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
        Please log in to view your bookings.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-20 text-white">
        Loading your bookings...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        My Bookings
      </h2>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-400">You have no bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              <img
                src={booking.imgUrl}
                alt={booking.productName}
                className="w-full h-48 object-cover"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/600x400/cccccc/ffffff?text=No+Image")
                }
              />
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {booking.productName}
                </h3>
                <p className="text-gray-400 text-sm mb-1">
                  Category: {booking.category}
                </p>
                <p className="text-gray-300 text-sm mb-1">
                  Quantity: {booking.quantity}
                </p>
                <p className="text-lg font-bold text-green-400 mb-2">
                  Total: ₹{parseFloat(booking.totalAmount).toFixed(2)}
                </p>
                <p className="text-gray-300 text-sm mb-1">
                  Ordered Date:{" "}
                  {moment(booking.orderedDate).format("MMMM Do YYYY, h:mm a")}
                </p>
                <p className="text-gray-300 text-sm mb-4">
                  Status:{" "}
                  <span
                    className={`font-semibold capitalize ${
                      booking.status === "confirmed"
                        ? "text-blue-400"
                        : booking.status === "delivered"
                        ? "text-green-400"
                        : booking.status === "cancelled"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>
                <p className="text-gray-300 text-sm mb-1">
                  Description: {booking.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
