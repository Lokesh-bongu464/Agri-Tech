const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Protected routes for bookings (require authentication)
router.use(protect); // All routes below this will require authentication

router.post("/", bookingController.createBooking); // Create a new booking
router.get("/user/:userId", bookingController.getBookingsByUserId); // Get bookings for a specific user

// Admin-only routes for booking management
// NEW: Route to get all bookings for admin
router.get("/", authorizeRoles("admin"), bookingController.getAllBookings); // <--- NEW LINE

router.put(
  "/:id/status",
  authorizeRoles("admin"),
  bookingController.updateBookingStatus
); // Update booking status
router.delete("/:id", authorizeRoles("admin"), bookingController.deleteBooking); // Delete a booking

module.exports = router;
