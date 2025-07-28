const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware"); // Import protect middleware

// Public User Routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Protected User Routes (require authentication)
router.get("/profile", protect, userController.getUserProfile);
router.put("/profile", protect, userController.updateUserProfile);

module.exports = router;
