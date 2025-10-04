const express = require("express");
const router = express.Router();
const farmersController = require("../controllers/farmersController");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { uploadSingle } = require("../middleware/upload");

// Post surplus with optional image
router.post(
  "/surplus",
  authenticate,
  authorizeRoles("Farmer"),
  uploadSingle("image"), // "image" is the key in form-data
  farmersController.postSurplus
);

// Donate produce with optional image
router.post(
  "/donate",
  authenticate,
  authorizeRoles("Farmer"),
  uploadSingle("image"),
  farmersController.donateProduce
);

// Get farmer reputation
router.get("/:farmerId/reputation", authenticate, authorizeRoles("Farmer"), farmersController.getReputation);

module.exports = router;
