const express = require("express");
const router = express.Router();
const farmersController = require("../controllers/farmersController");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { uploadSingle } = require("../middleware/upload");

// Post surplus with optional image
router.post(
  "/surplus",
  authenticate,
  authorizeRoles("farmer"), // lowercase
  uploadSingle("image"), 
  farmersController.postSurplus
);

// Donate produce with optional image
router.post(
  "/donate",
  authenticate,
  authorizeRoles("farmer"), // lowercase
  uploadSingle("image"),
  farmersController.donateProduce
);

// Get farmer reputation
router.get("/:farmerId/reputation", authenticate, authorizeRoles("farmer"), farmersController.getReputation);

router.get(
  "/dashboard",
  authenticate,
  authorizeRoles("farmer"),
  farmersController.getDashboard
);
module.exports = router;
