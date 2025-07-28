import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CONVENIENCE_FEE = 45;
const phoneNumberRegex = /^[0-9]{10}$/;

const BuyProduct = ({ showNotification }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load product details."
        );
        showNotification(
          err.response?.data?.message || "Failed to load product details.",
          "error"
        );
        navigate("/uproducts");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate, showNotification]);

  const handleQuantityChange = (val) => {
    const value = parseInt(val, 10);
    if (!value || value < 1) {
      setQuantity(1);
    } else if (value > 99) {
      setQuantity(99);
    } else {
      setQuantity(value);
    }
  };

  const price = product ? Number(product.price) : 0;
  const totalAmount = price * quantity + CONVENIENCE_FEE;

  const handleBuy = async (e) => {
    e.preventDefault();

    if (!user) {
      showNotification("Please log in to book products.", "warning");
      navigate("/ulogin");
      return;
    }

    if (!email) {
      showNotification("Please enter your email address.", "error");
      return;
    }

    // Simple email validation (can be improved)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification("Please enter a valid email address.", "error");
      return;
    }

    if (!phoneNumber) {
      showNotification("Please enter your phone number.", "error");
      return;
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
      showNotification("Please enter a valid 10-digit phone number.", "error");
      return;
    }

    if (!product?.inStock) {
      showNotification("This product is currently out of stock.", "error");
      return;
    }

    if (!product?.name) {
      showNotification(
        "Invalid product information. Please try again.",
        "error"
      );
      return;
    }

    try {
      await api.post("/bookings", {
        name: user.name,
        email,
        phno: phoneNumber,
        quantity: quantity.toString(),
        totalAmount: totalAmount.toString(),
        productName: product.name,
        category: product.category,
        description: product.description,
        imgUrl: product.imgUrl,
        userId: user.id,
        userName: user.name,
        price: price.toString(),
        convenienceFee: CONVENIENCE_FEE.toString(),
      });
      showNotification("Product booked successfully!", "success");
      navigate("/mybookings");
    } catch (err) {
      console.error("API booking error:", err);
      showNotification(
        err.response?.data?.message || "Failed to book product.",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-white">
        Loading product details...
      </div>
    );
  }
  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }
  if (!product) {
    return (
      <div className="text-center mt-20 text-gray-400">Product not found.</div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src={product.imgUrl}
            alt={product.name}
            className="w-full h-auto max-h-80 object-contain rounded-lg"
            onError={(e) =>
              (e.target.src =
                "https://placehold.co/600x400/cccccc/ffffff?text=No+Image")
            }
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-white mb-4">{product.name}</h2>
          <p className="text-gray-400 text-lg mb-2">{product.category}</p>
          <p className="text-3xl font-extrabold text-green-400 mb-4">
            ₹{price}
          </p>
          <p className="text-gray-300 mb-6">{product.description}</p>
          <p className="text-gray-400 text-sm mb-4">
            Status:{" "}
            {product.inStock ? (
              <span className="text-green-500 font-semibold">In Stock</span>
            ) : (
              <span className="text-red-500 font-semibold">Out of Stock</span>
            )}
          </p>

          <form onSubmit={handleBuy} className="space-y-4">
            {/* Name (prefilled and disabled) */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-300 text-sm font-bold mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={user.name}
                disabled
                readOnly
                className="w-full py-2 px-3 rounded bg-gray-700 text-gray-300 border border-gray-600"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-300 text-sm font-bold mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full py-2 px-3 rounded bg-gray-700 text-gray-300 border border-gray-600"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-300 text-sm font-bold mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="Enter your 10-digit phone number"
                className="w-full py-2 px-3 rounded bg-gray-700 text-gray-300 border border-gray-600"
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || !product.inStock}
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                min={1}
                max={99}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="w-16 text-center py-1 rounded bg-gray-700 text-white border border-gray-600"
                disabled={!product.inStock}
                required
              />
              <button
                type="button"
                className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={!product.inStock}
              >
                +
              </button>
            </div>

            {/* Price Summary */}
            <div className="mb-4">
              <div className="flex justify-between text-gray-300">
                <span>Price</span>
                <span>₹{price}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Convenience Fee</span>
                <span>₹{CONVENIENCE_FEE}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg mt-2">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!product.inStock}
              className={`w-full py-3 rounded font-bold text-lg transition ${
                product.inStock
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyProduct;
