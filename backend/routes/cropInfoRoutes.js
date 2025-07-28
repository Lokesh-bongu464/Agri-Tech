const express = require("express");
const router = express.Router();
const cropInfoController = require("../controllers/cropInfoController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Public routes
router.get("/", cropInfoController.getAllCropInfos);
router.get("/:id", cropInfoController.getCropInfoById);

// Admin-protected routes
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  cropInfoController.createCropInfo
);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  cropInfoController.updateCropInfo
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  cropInfoController.deleteCropInfo
);

module.exports = router;
