import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";

const AddCrop = ({ showNotification }) => {
  const [name, setName] = useState("");
  const [variety, setVariety] = useState("");
  const [quantity, setQuantity] = useState("");
  const [plantedDate, setPlantedDate] = useState("");
  const [estimatedHarvestDate, setEstimatedHarvestDate] = useState("");
  // imgUrl state is REMOVED
  // const [imgUrl, setImgUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Crop name is required.";
    if (!variety.trim()) newErrors.variety = "Variety is required.";
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      newErrors.quantity = "Quantity must be a positive number.";
    }
    if (!plantedDate) {
      newErrors.plantedDate = "Planted date is required.";
    } else if (moment(plantedDate).isAfter(moment())) {
      newErrors.plantedDate = "Planted date cannot be in the future.";
    }
    if (!estimatedHarvestDate) {
      newErrors.estimatedHarvestDate = "Estimated harvest date is required.";
    } else if (moment(estimatedHarvestDate).isBefore(moment(plantedDate))) {
      newErrors.estimatedHarvestDate =
        "Harvest date cannot be before planted date.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showNotification("Please log in to add crops.", "warning");
      navigate("/ulogin");
      return;
    }
    if (!validateForm()) {
      showNotification("Please correct the errors in the form.", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/crops", {
        name,
        variety,
        quantity: parseInt(quantity),
        plantedDate,
        estimatedHarvestDate,
        userId: user.id,
        userName: user.name,
        // imgUrl is REMOVED from payload
      });
      showNotification(
        response.data.message || "Crop added successfully!",
        "success"
      );
      navigate("/getcrops");
    } catch (err) {
      console.error("Error adding crop:", err);
      showNotification(
        err.response?.data?.message || "Failed to add crop.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Add New Crop
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Crop Name:
            </label>
            <input
              type="text"
              id="name"
              className={`shadow appearance-none border ${
                errors.name ? "border-red-500" : "border-gray-700"
              } rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: null });
              }}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="variety"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Variety:
            </label>
            <input
              type="text"
              id="variety"
              className={`shadow appearance-none border ${
                errors.variety ? "border-red-500" : "border-gray-700"
              } rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
              value={variety}
              onChange={(e) => {
                setVariety(e.target.value);
                setErrors({ ...errors, variety: null });
              }}
              required
            />
            {errors.variety && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.variety}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              className={`shadow appearance-none border ${
                errors.quantity ? "border-red-500" : "border-gray-700"
              } rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setErrors({ ...errors, quantity: null });
              }}
              min="1"
              required
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.quantity}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="plantedDate"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Planted Date:
            </label>
            <input
              type="date"
              id="plantedDate"
              className={`shadow appearance-none border ${
                errors.plantedDate ? "border-red-500" : "border-gray-700"
              } rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
              value={plantedDate}
              onChange={(e) => {
                setPlantedDate(e.target.value);
                setErrors({ ...errors, plantedDate: null });
              }}
              required
            />
            {errors.plantedDate && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.plantedDate}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="estimatedHarvestDate"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Estimated Harvest Date:
            </label>
            <input
              type="date"
              id="estimatedHarvestDate"
              className={`shadow appearance-none border ${
                errors.estimatedHarvestDate
                  ? "border-red-500"
                  : "border-gray-700"
              } rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
              value={estimatedHarvestDate}
              onChange={(e) => {
                setEstimatedHarvestDate(e.target.value);
                setErrors({ ...errors, estimatedHarvestDate: null });
              }}
              required
            />
            {errors.estimatedHarvestDate && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.estimatedHarvestDate}
              </p>
            )}
          </div>
          {/* imgUrl input field is REMOVED */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-200 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Add Crop"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCrop;
