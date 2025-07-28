const Product = require("../models/productModel");
const mongoose = require("mongoose"); // Import mongoose to check ObjectId validity

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  const productId = req.params.id;

  // Check if the ID is a valid MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    console.error("Invalid Product ID format received:", productId);
    return res.status(400).json({ message: "Invalid Product ID format." });
  }

  try {
    // Attempt to find the product using findById
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found in database." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Server error fetching product." });
  }
};
