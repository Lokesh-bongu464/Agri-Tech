const Farm = require("../models/farmModel");

// @desc    Add a new farm
// @route   POST /api/farms
// @access  Private (User)
exports.addFarm = async (req, res) => {
  const { name, location, areaSize, cropType, userName } = req.body;
  const userId = req.user.id; // Get userId from authenticated user

  try {
    const newFarm = new Farm({
      name,
      location,
      areaSize,
      cropType,
      userId,
      userName,
    });
    await newFarm.save();
    res.status(201).json({ message: "Farm added successfully", farm: newFarm });
  } catch (error) {
    console.error("Error adding farm:", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Get all farms (Admin view, or public if desired)
// @route   GET /api/farms
// @access  Public (or Private Admin)
exports.getAllFarms = async (req, res) => {
  try {
    const farms = await Farm.find();
    res.status(200).json(farms);
  } catch (error) {
    console.error("Error fetching all farms:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Get farms associated with a specific user
// @route   GET /api/farms/user/:userId
// @access  Private (User) - User can only see their own farms
exports.getFarmsByUserId = async (req, res) => {
  const { userId } = req.params;
  // In a real application, you'd verify that req.user.id matches userId
  // or that req.user.role is 'admin'.
  try {
    const farms = await Farm.find({ userId });
    res.status(200).json(farms);
  } catch (error) {
    console.error("Error fetching farms by user ID:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Get a single farm by ID
// @route   GET /api/farms/:id
// @access  Private (User) - User can only see their own farm, or Admin can see any
exports.getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ message: "Farm not found." });
    }
    // Optional: Add authorization check here if a user can only view their own farms
    // if (farm.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Not authorized to view this farm.' });
    // }
    res.status(200).json(farm);
  } catch (error) {
    console.error("Error fetching farm by ID:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Farm ID format." });
    }
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Update a farm by ID
// @route   PUT /api/farms/:id
// @access  Private (User)
exports.updateFarm = async (req, res) => {
  const { id } = req.params;
  const { name, location, areaSize, cropType } = req.body;

  try {
    const farm = await Farm.findById(id);
    if (!farm) {
      return res.status(404).json({ message: "Farm not found." });
    }

    // Authorization: Ensure the user owns this farm or is an admin
    if (farm.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this farm." });
    }

    if (name !== undefined) farm.name = name;
    if (location !== undefined) farm.location = location;
    if (areaSize !== undefined) farm.areaSize = areaSize;
    if (cropType !== undefined) farm.cropType = cropType;

    const updatedFarm = await farm.save();
    res
      .status(200)
      .json({ message: "Farm updated successfully", farm: updatedFarm });
  } catch (error) {
    console.error("Error updating farm:", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Delete a farm by ID
// @route   DELETE /api/farms/:id
// @access  Private (User)
exports.deleteFarm = async (req, res) => {
  const { id } = req.params;
  try {
    const farm = await Farm.findById(id);
    if (!farm) {
      return res.status(404).json({ message: "Farm not found." });
    }

    // Authorization: Ensure the user owns this farm or is an admin
    if (farm.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this farm." });
    }

    await farm.deleteOne();
    res.status(200).json({ message: "Farm deleted successfully." });
  } catch (error) {
    console.error("Error deleting farm:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};
