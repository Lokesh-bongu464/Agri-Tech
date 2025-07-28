const Admin = require("../models/adminModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Farm = require("../models/farmModel");
const Crop = require("../models/cropModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");

// Admin login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found." });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: admin._id, role: "admin" }, config.jwtSecret, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Error logging in admin:", error.message);
    res.status(500).json({ message: "Server error during login." });
  }
};

// Admin registration
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await Admin.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ message: "Admin with this email already exists." });

    const admin = new Admin({ name, email, password });
    await admin.save();

    const token = jwt.sign({ id: admin._id, role: "admin" }, config.jwtSecret, {
      expiresIn: "1h",
    });
    res.status(201).json({
      message: "Admin account created successfully.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Error registering admin:", error.message);
    if (error.name === "ValidationError")
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Server error during registration." });
  }
};

// Get all products (admin)
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products for admin:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// Get product by ID (admin)
exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(productId))
    return res.status(400).json({ message: "Invalid Product ID format." });

  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found." });
    res.status(200).json(product);
  } catch (error) {
    console.error("Admin getProductById error:", error);
    res.status(500).json({ message: "Server error fetching product." });
  }
};

// Add product (admin)
exports.addProduct = async (req, res) => {
  const { name, category, price, description, imgUrl } = req.body;
  try {
    const newProduct = new Product({
      name,
      category,
      price,
      description,
      imgUrl,
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error.message);
    if (error.name === "ValidationError")
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Server error." });
  }
};

// Update product (admin)
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, description, imgUrl, inStock } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ message: "Product not found." });

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (imgUrl !== undefined) product.imgUrl = imgUrl;
    if (inStock !== undefined) product.inStock = inStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product (admin)
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin, with farms and crops)
exports.getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    const farms = await Farm.find().lean();
    const crops = await Crop.find().lean();

    const userFarmsMap = farms.reduce((acc, farm) => {
      const userIdString = farm.userId.toString();
      if (!acc[userIdString]) acc[userIdString] = [];
      acc[userIdString].push(farm);
      return acc;
    }, {});

    const userCropsMap = crops.reduce((acc, crop) => {
      const userIdString = crop.userId.toString();
      if (!acc[userIdString]) acc[userIdString] = [];
      acc[userIdString].push(crop);
      return acc;
    }, {});

    const usersWithFarmsAndCrops = users.map((user) => ({
      ...user,
      farms: userFarmsMap[user._id.toString()] || [],
      crops: userCropsMap[user._id.toString()] || [],
    }));

    res.status(200).json(usersWithFarmsAndCrops);
  } catch (error) {
    console.error(
      "Error fetching users for admin (with farms and crops):",
      error.message
    );
    res.status(500).json({ message: "Server error fetching users." });
  }
};

// Get user by ID (admin)
exports.getUserByIdAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    if (error.kind === "ObjectId")
      return res.status(400).json({ message: "Invalid User ID format." });
    res.status(500).json({ message: "Server error." });
  }
};

// Update user (admin)
exports.updateUserAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;

    if (password !== undefined && password.length > 0) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();
    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError")
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Server error." });
  }
};

// Delete user (admin)
exports.deleteUserAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
