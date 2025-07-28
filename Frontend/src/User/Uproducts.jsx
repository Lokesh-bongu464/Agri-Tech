import React, { useEffect, useState } from "react";
import api from "../services/api"; // Import your api service
import { Link } from "react-router-dom"; // Assuming you use Link for navigation

const Uproducts = ({ showNotification }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // This route is public for users to view products
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products for users:", err);
        setError(err.response?.data?.message || "Failed to fetch products.");
        showNotification(
          err.response?.data?.message || "Failed to fetch products.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showNotification]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-white">Loading products...</div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Available Products
      </h2>
      {products.length === 0 ? (
        <p className="text-center text-gray-400">
          No products available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              <img
                src={product.imgUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/600x400/cccccc/ffffff?text=No+Image")
                }
              />
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm mb-1">{product.category}</p>
                <p className="text-lg font-bold text-green-400 mb-2">
                  ₹{product.price.toFixed(2)}
                </p>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {product.description}
                </p>
              </div>
              <div className="p-4 border-t border-gray-700">
                {product.inStock ? (
                  <Link
                    to={`/buyproduct/${product._id}`}
                    className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                  >
                    Buy Now
                  </Link>
                ) : (
                  <button
                    className="block w-full text-center bg-red-600 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Uproducts;
