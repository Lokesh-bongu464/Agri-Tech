const CropInfo = require("../models/cropInfoModel");

// Get a single crop info by ID
exports.getCropInfoById = async (req, res) => {
  try {
    const crop = await CropInfo.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: "Crop info not found." });
    }
    res.status(200).json(crop);
  } catch (error) {
    res.status(400).json({ message: "Invalid crop info ID." });
  }
};

// (Optional) Other CRUD methods:

exports.getAllCropInfos = async (req, res) => {
  try {
    const crops = await CropInfo.find();
    res.status(200).json(crops);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.createCropInfo = async (req, res) => {
  try {
    const cropInfo = new CropInfo(req.body);
    await cropInfo.save();
    res.status(201).json({ message: "Crop info created.", cropInfo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCropInfo = async (req, res) => {
  try {
    const crop = await CropInfo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!crop) return res.status(404).json({ message: "Crop info not found." });
    res.status(200).json({ message: "Crop info updated.", crop });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCropInfo = async (req, res) => {
  try {
    const crop = await CropInfo.findByIdAndDelete(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop info not found." });
    res.status(200).json({ message: "Crop info deleted." });
  } catch (error) {
    res.status(400).json({ message: "Invalid crop info ID." });
  }
};
