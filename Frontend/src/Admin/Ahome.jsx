import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Ahome({ showNotification }) {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return;

      if (!isAuthenticated || !user || user.role !== "admin") {
        showNotification(
          "Access Denied: You must be logged in as an Admin.",
          "error"
        );
        logout();
        navigate("/alogin");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const usersResponse = await api.get("/admin/users");
        setUsers(usersResponse.data);

        const productsResponse = await api.get("/admin/products");
        setProducts(productsResponse.data);

        const farmsResponse = await api.get("/farms");
        setFarms(farmsResponse.data);
      } catch (err) {
        console.error("Error fetching dashboard data: ", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data."
        );
        showNotification(
          err.response?.data?.message || "Failed to load dashboard data.",
          "error"
        );
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate("/alogin");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthenticated, authLoading, showNotification, navigate, logout]);

  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalFarms = farms.length;

  // Data with Farms and Products swapped in order
  const data = [
    { name: "Users", value: totalUsers },
    { name: "Farms", value: totalFarms },
    { name: "Products", value: totalProducts },
  ];

  // Colors mapped to match the order above: Users (purple), Farms (red), Products (teal)
  const colors = ["#8884d8", "red", "teal"];

  if (authLoading) {
    return (
      <div className="text-center mt-20 text-white">
        Loading authentication...
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return (
      <div className="text-center mt-20 text-red-500">
        Access Denied: You must be logged in as an Admin to view this dashboard.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center p-4">
        <h3 className="text-center text-4xl font-bold text-white mb-8">
          Admin Dashboard
        </h3>
        <div className="bg-gray-800 w-full max-w-5xl mx-auto p-8 rounded-lg shadow-xl flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
          <p className="mt-4 text-white text-xl">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h3 className="text-center text-4xl font-bold text-white mb-8">
        Admin Dashboard
      </h3>
      <div className="bg-gray-800 w-full max-w-5xl mx-auto p-8 rounded-lg shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link to="/users" className="no-underline">
            <div className="w-full h-32 rounded-lg shadow-md flex flex-col justify-center items-center text-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition duration-200 transform hover:scale-105">
              USERS <br />
              <span className="text-4xl">{totalUsers}</span>
            </div>
          </Link>

          {/* Farms card: Static for admin, no link */}
          <div
            className="w-full h-32 rounded-lg shadow-md flex flex-col justify-center items-center text-2xl font-bold text-white bg-red-500 cursor-default select-none"
            title="Farm management is not accessible to admins"
          >
            Farms <br />
            <span className="text-4xl">{totalFarms}</span>
          </div>

          <Link to="/getproducts" className="no-underline">
            <div className="w-full h-32 rounded-lg shadow-md flex flex-col justify-center items-center text-2xl font-bold text-white bg-teal-600 hover:bg-teal-700 transition duration-200 transform hover:scale-105">
              Products <br />
              <span className="text-4xl">{totalProducts}</span>
            </div>
          </Link>
        </div>
        <div className="mt-10 flex justify-center items-center h-80 w-full">
          <ResponsiveContainer width="90%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.1)" }}
                contentStyle={{
                  backgroundColor: "#333",
                  border: "none",
                  color: "#fff",
                }}
              />
              <Legend wrapperStyle={{ color: "#cbd5e0" }} />
              <Bar dataKey="value" barSize={50}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Admin Booking Management Link */}
        <div className="mt-8 text-center w-full">
          <Link
            to="/admin/bookings"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-200 inline-block transform hover:scale-105 text-lg"
          >
            Manage Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Ahome;
