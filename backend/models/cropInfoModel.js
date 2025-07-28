const mongoose = require("mongoose");

const cropInfoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    scientificName: { type: String, trim: true },
    season: String,
    temperatureRange: String,
    rainfallRange: String,
    soilType: String,
    sowingTime: String,
    harvestTime: String,
    duration: String,
    imgUrl: String,
    pesticides: [String],
    fertilizers: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CropInfo", cropInfoSchema);
