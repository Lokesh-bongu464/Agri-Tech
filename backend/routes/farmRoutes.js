const express = require("express");
const router = express.Router();
const farmController = require("../controllers/farmController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Public route to get all farms (if public viewing is desired)
router.get("/", farmController.getAllFarms);

// Protected routes for user-managed farms (require authentication)
router.use(protect); // All routes below this will require authentication

router.post("/", farmController.addFarm); // Add a new farm
router.get("/user/:userId", farmController.getFarmsByUserId); // User-specific farms
router.get("/:id", farmController.getFarmById); // Single farm by ID
router.put("/:id", farmController.updateFarm); // Update a farm
router.delete("/:id", farmController.deleteFarm); // Delete a farm

// Example of an admin-only route for farms (if needed)
// router.get('/all', authorizeRoles('admin'), farmController.getAllFarmsAdmin); // Admin can see all farms regardless of user
module.exports = router;
