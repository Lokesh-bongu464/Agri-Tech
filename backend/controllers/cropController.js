// controllers/cropController.js

const Crop = require("../models/cropModel");

// @desc    Get all crops associated with a specific user
// @route   GET /api/crops/user/:userId
// @access  Private (User) or Admin
exports.getCropsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const crops = await Crop.find({ userId });
    res.status(200).json(crops);
  } catch (error) {
    console.error("Error fetching crops by user ID:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Get a single crop by ID
// @route   GET /api/crops/:id
// @access  Private (User) or Admin
exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found." });
    }
    res.status(200).json(crop);
  } catch (error) {
    console.error("Error fetching crop by ID:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Crop ID format." });
    }
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Add a new crop (user planting)
// @route   POST /api/crops
// @access  Private (User)
exports.addCrop = async (req, res) => {
  const {
    name,
    variety,
    quantity,
    plantedDate,
    estimatedHarvestDate,
    userId,
    userName,
  } = req.body;
  const crop = new Crop({
    name,
    variety,
    quantity,
    plantedDate,
    estimatedHarvestDate,
    userId,
    userName,
  });
  try {
    const newCrop = await crop.save();
    res.status(201).json(newCrop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update a crop
// @route   PUT /api/crops/:id
// @access  Private (User)
exports.updateCrop = async (req, res) => {
  const { id } = req.params;
  const { name, variety, quantity, plantedDate, estimatedHarvestDate } =
    req.body;

  try {
    const crop = await Crop.findById(id);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found." });
    }

    if (name !== undefined) crop.name = name;
    if (variety !== undefined) crop.variety = variety;
    if (quantity !== undefined) crop.quantity = quantity;
    if (plantedDate !== undefined) crop.plantedDate = plantedDate;
    if (estimatedHarvestDate !== undefined)
      crop.estimatedHarvestDate = estimatedHarvestDate;

    const updatedCrop = await crop.save();
    res.json(updatedCrop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a crop
// @route   DELETE /api/crops/:id
// @access  Private (User)
exports.deleteCrop = async (req, res) => {
  const { id } = req.params;
  try {
    const crop = await Crop.findById(id);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }
    await crop.deleteOne();
    res.json({ message: "Crop deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
