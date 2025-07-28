const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Public Product Routes (no authentication needed to view products)
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Note: Add, Update, Delete Product routes are handled in adminRoutes.js
// as they require admin privileges.

module.exports = router;
