const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    variety: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    plantedDate: {
      type: Date,
      required: true,
    },
    estimatedHarvestDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return this.plantedDate <= v;
        },
        message: (props) =>
          `Estimated harvest date (${props.value}) must be after or on the planted date!`,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      trim: true,
    },
    // imgUrl field is REMOVED in this version
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Crop", cropSchema);
