const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Price cannot be negative
    },
    description: {
      type: String,
      trim: true,
    },
    imgUrl: {
      type: String,
      trim: true,
      default: "https://placehold.co/600x400/cccccc/ffffff?text=No+Image", // Default image for products without one
    },
    inStock: {
      // Added a field to track stock availability
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

module.exports = mongoose.model("Product", productSchema);
