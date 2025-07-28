import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";

const UpdateCrop = ({ showNotification }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [variety, setVariety] = useState("");
  const [quantity, setQuantity] = useState("");
  const [plantedDate, setPlantedDate] = useState("");
  const [estimatedHarvestDate, setEstimatedHarvestDate] = useState("");
  // imgUrl state is REMOVED
  // const [imgUrl, setImgUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchCrop = async () => {
      if (authLoading || !isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/crops/${id}`);
        const cropData = response.data;

        if (cropData.userId !== user.id && user.role !== "admin") {
          showNotification("Not authorized to view/edit this crop.", "error");
          navigate("/getcrops");
          return;
        }

        setName(cropData.name);
        setVariety(cropData.variety);
        setQuantity(cropData.quantity);
        setPlantedDate(moment(cropData.plantedDate).format("YYYY-MM-DD"));
        setEstimatedHarvestDate(
          moment(cropData.estimatedHarvestDate).format("YYYY-MM-DD")
        );
        // imgUrl is REMOVED from fetched data
        // setImgUrl(cropData.imgUrl || '');
      } catch (err) {
        console.error("Error fetching crop for update:", err);
        setError(
          err.response?.data?.message || "Failed to load crop data.",
          "error"
        );
        showNotification(
          err.response?.data?.message || "Failed to load crop data.",
          "error"
        );
        navigate("/getcrops");
      } finally {
        setLoading(false);
      }
    };
    fetchCrop();
  }, [id, navigate, showNotification, user, isAuthenticated, authLoading]);

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
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showNotification("Please log in to update crops.", "warning");
      navigate("/ulogin");
      return;
    }
    if (!validateForm()) {
      showNotification("Please correct the errors in the form.", "warning");
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await api.put(`/crops/${id}`, {
        name,
        variety,
        quantity: parseInt(quantity),
        plantedDate,
        estimatedHarvestDate,
        // imgUrl is REMOVED from update payload
      });
      showNotification(
        response.data.message || "Crop updated successfully!",
        "success"
      );
      navigate("/getcrops");
    } catch (err) {
      console.error("Error updating crop:", err);
      showNotification(
        err.response?.data?.message || "Failed to update crop.",
        "error"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

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
        Please log in to update crops.
      </div>
    );
  }

  if (loading && !name) {
    return (
      <div className="text-center mt-20 text-white">Loading crop data...</div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Update Crop
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
                formErrors.name ? "border-red-500" : "border-gray-700"
              } rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFormErrors({ ...formErrors, name: null });
              }}
              required
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.name}
              </p>
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
                formErrors.variety ? "border-red-500" : "border-gray-700"
              } rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
              value={variety}
              onChange={(e) => {
                setVariety(e.target.value);
                setFormErrors({ ...formErrors, variety: null });
              }}
              required
            />
            {formErrors.variety && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.variety}
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
                formErrors.quantity ? "border-red-500" : "border-gray-700"
              } rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setFormErrors({ ...formErrors, quantity: null });
              }}
              min="1"
              required
            />
            {formErrors.quantity && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.quantity}
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
                formErrors.plantedDate ? "border-red-500" : "border-gray-700"
              } rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
              value={plantedDate}
              onChange={(e) => {
                setPlantedDate(e.target.value);
                setFormErrors({ ...formErrors, plantedDate: null });
              }}
              required
            />
            {formErrors.plantedDate && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.plantedDate}
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
                formErrors.estimatedHarvestDate
                  ? "border-red-500"
                  : "border-gray-700"
              } rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
              value={estimatedHarvestDate}
              onChange={(e) => {
                setEstimatedHarvestDate(e.target.value);
                setFormErrors({ ...formErrors, estimatedHarvestDate: null });
              }}
              required
            />
            {formErrors.estimatedHarvestDate && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.estimatedHarvestDate}
              </p>
            )}
          </div>
          {/* imgUrl input field is REMOVED */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-200 flex items-center justify-center"
            disabled={submitLoading}
          >
            {submitLoading ? (
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
              "Update Crop"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCrop;
