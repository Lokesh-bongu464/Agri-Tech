const express = require("express");
const router = express.Router();

// Existing route imports
const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const cropRoutes = require("./cropRoutes");
const farmRoutes = require("./farmRoutes");
const bookingRoutes = require("./bookingRoutes");

// New import for admin-managed crop info routes
const cropInfoRoutes = require("./cropInfoRoutes");

// Mount existing routers
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/crops", cropRoutes);
router.use("/farms", farmRoutes);
router.use("/bookings", bookingRoutes);

// Mount crop info routes for managing crop metadata
router.use("/cropinfos", cropInfoRoutes);

// Optional: root API route
router.get("/", (req, res) => {
  res.send("Welcome to the Agri-Tech API!");
});

module.exports = router;
