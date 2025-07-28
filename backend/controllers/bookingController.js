const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");

// @desc    Create a new product booking
// @route   POST /api/bookings
// @access  Private (User)
exports.createBooking = async (req, res) => {
  const {
    name,
    email,
    phno,
    quantity,
    totalAmount,
    productName,
    category,
    description,
    imgUrl,
    userName,
    userId,
  } = req.body;

  try {
    // Optional: Validate required fields explicitly here or rely on Mongoose validation
    if (
      !name ||
      !email ||
      !phno ||
      !quantity ||
      !totalAmount ||
      !productName ||
      !userId
    ) {
      return res
        .status(400)
        .json({ message: "Missing required booking fields." });
    }

    const newBooking = new Booking({
      name,
      email,
      phno,
      quantity,
      totalAmount,
      productName,
      category,
      description,
      imgUrl,
      userId,
      userName,
    });

    await newBooking.save();

    res
      .status(201)
      .json({ message: "Booked successfully", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    const message =
      error.name === "ValidationError"
        ? error.message
        : "Failed to create booking";
    res.status(500).json({ message });
  }
};

// @desc    Get all bookings for a specific user
// @route   GET /api/bookings/user/:userId
// @access  Private (User) - User can only see their own bookings, or Admin can see all
exports.getBookingsByUserId = async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  try {
    const bookings = await Booking.find({ userId }).sort({ orderedDate: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Failed to fetch user-specific bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// @desc    Update booking status (typically admin-only)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid booking ID format." });
  }

  if (
    !status ||
    !["pending", "confirmed", "cancelled", "delivered"].includes(status)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid or missing status value." });
  }

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    const updatedBooking = await booking.save();

    res.status(200).json({
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    const message =
      error.name === "ValidationError"
        ? error.message
        : "Failed to update booking status";
    res.status(500).json({ message });
  }
};

// @desc    Delete a booking (typically admin-only, or user can cancel their own)
// @route   DELETE /api/bookings/:id
// @access  Private (User/Admin)
exports.deleteBooking = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid booking ID format." });
  }

  try {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Failed to delete booking" });
  }
};

// @desc    Get all bookings for Admin
// @route   GET /api/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ orderedDate: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings for admin:", error.message);
    res.status(500).json({ message: "Server error fetching all bookings." });
  }
};
