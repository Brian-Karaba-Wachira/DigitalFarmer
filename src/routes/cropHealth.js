const express = require("express");
const multer = require("multer");
const router = express.Router();
const cropHealthController = require("../controllers/cropHealthController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// Multer setup for in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Only authenticated farmers can upload crop images
router.post(
  "/upload",
  authenticate,
  authorizeRoles("Farmer"),
  upload.single("image"),
  cropHealthController.uploadCropImage
);

// Only authenticated farmers can access their crop health record
router.get(
  "/:id",
  authenticate,
  authorizeRoles("Farmer"),
  cropHealthController.getCropHealth
);

// Optional: list all crop health records for the logged-in farmer
router.get(
  "/",
  authenticate,
  authorizeRoles("Farmer"),
  cropHealthController.listCropHealth
);

module.exports = router;
