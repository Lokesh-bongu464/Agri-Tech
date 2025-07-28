const express = require("express");
const router = express.Router();
const cropController = require("../controllers/cropController");
const { protect } = require("../middleware/authMiddleware");

// Remove these routes because those controller functions no longer exist or are undefined
// router.get("/data", cropController.getStaticCropData);
// router.get("/data/:name", cropController.getStaticCropDataByName);

// Use this if you want a route to get all user crops — make sure function is exported
// router.get("/all", cropController.getAllCrops); // uncomment only if you implement this

// Protect all routes below with authentication middleware
router.use(protect);

// User crop routes
router.get("/user/:userId", cropController.getCropsByUserId);
router.get("/:id", cropController.getCropById);
router.post("/", cropController.addCrop);
router.put("/:id", cropController.updateCrop);
router.delete("/:id", cropController.deleteCrop);

module.exports = router;
