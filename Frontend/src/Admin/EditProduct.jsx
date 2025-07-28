import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = ({ showNotification }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [inStock, setInStock] = useState(true);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      showNotification("Product ID missing. Redirecting.", "error");
      navigate("/getproducts");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/admin/products/${id}`);
        const product = response.data;

        setName(product.name || "");
        setCategory(product.category || "");
        setPrice(product.price !== undefined ? product.price.toString() : "");
        setDescription(product.description || "");
        setImgUrl(product.imgUrl || "");
        setInStock(product.inStock !== undefined ? product.inStock : true);

        setLoading(false);
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to load product data.";
        setError(message);
        showNotification(message, "error");
        setLoading(false);

        if (err.response?.status === 404 || err.response?.status === 400) {
          navigate("/getproducts");
        }
      }
    };

    fetchProduct();
  }, [id, navigate, showNotification]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Product name is required.";
    if (!category.trim()) newErrors.category = "Category is required.";
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      newErrors.price = "Price must be a positive number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification("Please correct the errors in the form.", "warning");
      return;
    }

    setSubmitLoading(true);

    try {
      const updateData = {
        name,
        category,
        price: parseFloat(price),
        description,
        imgUrl,
        inStock,
      };

      const response = await api.put(`/admin/products/${id}`, updateData);

      showNotification(
        response.data.message || "Product updated successfully!",
        "success"
      );

      navigate("/getproducts");
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to update product.",
        "error"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-white">
        Loading product data...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Edit Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Product Name:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((errs) => ({ ...errs, name: null }));
              }}
              className={`shadow appearance-none border ${
                errors.name ? "border-red-500" : "border-gray-700"
              } rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Category:
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setErrors((errs) => ({ ...errs, category: null }));
              }}
              className={`shadow appearance-none border ${
                errors.category ? "border-red-500" : "border-gray-700"
              } rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
              required
            />
            {errors.category && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.category}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Price:
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-lg font-semibold select-none">
                ₹
              </span>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setErrors((errs) => ({ ...errs, price: null }));
                }}
                className={`pl-8 shadow appearance-none border ${
                  errors.price ? "border-red-500" : "border-gray-700"
                } rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
                required
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-xs italic mt-1">{errors.price}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Description:
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
            />
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="imgUrl"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Image URL:
            </label>
            <input
              id="imgUrl"
              type="url"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
            />
          </div>

          {/* In Stock */}
          <div className="flex items-center">
            <input
              id="inStock"
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="form-checkbox h-5 w-5 text-green-600 rounded"
            />
            <label
              htmlFor="inStock"
              className="ml-2 text-gray-300 text-sm font-bold"
            >
              In Stock
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full flex items-center justify-center"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM6 17.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Update Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
