const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Public routes for admin login and registration
// Ensure adminController.loginAdmin and adminController.registerAdmin are correctly exported
router.post("/login", adminController.loginAdmin); // Check if adminController.loginAdmin is defined
router.post("/register", adminController.registerAdmin); // Check if adminController.registerAdmin is defined

// Protect all routes below and restrict to 'admin'
router.use(protect);
router.use(authorizeRoles("admin"));

// Admin Product routes
router.get("/products", adminController.getAllProductsAdmin);
router.post("/products", adminController.addProduct);
router.put("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);

// Get product by ID route (this is the one you added to adminController and made it work)
router.get("/products/:id", adminController.getProductById); // Ensure this line is present and correct

// Admin user management endpoints
router.get("/users", adminController.getAllUsersAdmin);
router.get("/users/:id", adminController.getUserByIdAdmin);
router.put("/users/:id", adminController.updateUserAdmin);
router.delete("/users/:id", adminController.deleteUserAdmin);

module.exports = router;
