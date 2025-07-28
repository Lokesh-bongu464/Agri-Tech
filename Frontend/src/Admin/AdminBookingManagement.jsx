import React, { useEffect, useState } from "react";
import api from "../services/api";
import moment from "moment";

const AdminBookingManagement = ({ showNotification }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use api.get for the new route to fetch ALL bookings for admin
      const response = await api.get("/bookings"); // This route is now protected in backend
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching all bookings for admin:", err);
      setError(err.response?.data?.message || "Failed to fetch bookings.");
      showNotification(
        err.response?.data?.message || "Failed to fetch bookings.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, [showNotification]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      setBookings(
        bookings.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b
        )
      );
      showNotification(
        response.data.message || `Booking status updated to ${newStatus}!`,
        "success"
      );
    } catch (err) {
      console.error("Error updating booking status:", err);
      showNotification(
        err.response?.data?.message || "Failed to update booking status.",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-white">
        Loading all bookings...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Manage All Bookings
      </h2>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-400">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Booked By
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Total Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Ordered Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    <div className="flex items-center">
                      <img
                        src={booking.imgUrl}
                        alt={booking.productName}
                        className="h-10 w-10 object-cover rounded-md mr-3"
                        onError={(e) =>
                          (e.target.src =
                            "https://placehold.co/40x40/cccccc/ffffff?text=No+Img")
                        }
                      />
                      {booking.productName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {booking.userName || booking.name}{" "}
                    {booking.email && `(${booking.email})`}
                    {booking.phno && (
                      <>
                        <br />
                        <span className="text-gray-400 text-xs">
                          📞 {booking.phno}
                        </span>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {booking.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    ₹{parseFloat(booking.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {moment(booking.orderedDate).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : booking.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(booking._id, e.target.value)
                      }
                      className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookingManagement;
