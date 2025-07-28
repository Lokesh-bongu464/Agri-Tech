import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import ConfirmationDialog from "../Components/ConfirmationDialog"; // Adjust the path if needed

const GetProducts = ({ showNotification }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/admin/products");
        setProducts(response.data);
      } catch (err) {
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

  // Open confirmation dialog and set product for deletion
  const onDeleteClick = (id) => {
    setProductToDelete(id);
    setIsDialogOpen(true);
  };

  // Confirm the deletion
  const handleDeleteConfirmed = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/admin/products/${productToDelete}`);
      setProducts(
        products.filter((product) => product._id !== productToDelete)
      );
      showNotification("Product deleted successfully!", "success");
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to delete product.",
        "error"
      );
    } finally {
      setIsDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Cancel the deletion dialog
  const handleDeleteCancelled = () => {
    setIsDialogOpen(false);
    setProductToDelete(null);
  };

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
      {/* Heading and Add Button */}
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Manage Products
      </h2>
      <div className="flex justify-end mb-4">
        <Link
          to="/addproduct"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-400">
          No products found. Add some!
        </p>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-700 table-fixed">
            <thead className="bg-gray-700">
              <tr>
                <th className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="w-36 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  In Stock
                </th>
                <th className="w-32 px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.imgUrl}
                      alt={product.name}
                      className="h-16 w-16 object-cover rounded-md"
                      onError={(e) =>
                        (e.target.src =
                          "https://placehold.co/600x400/cccccc/ffffff?text=No+Image")
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 max-w-[200px] truncate">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 max-w-[140px] truncate">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    ₹{product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 max-w-xs truncate">
                    {product.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.inStock ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-4 min-w-[120px]">
                      <Link
                        to={`/editproduct/${product._id}`}
                        className="text-indigo-400 hover:text-indigo-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => onDeleteClick(product._id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this product?"
        onConfirm={handleDeleteConfirmed}
        onCancel={handleDeleteCancelled}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default GetProducts;
