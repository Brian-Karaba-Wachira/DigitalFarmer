const express = require("express");
const router = express.Router();
const donorsController = require("../controllers/donorsController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// Post a donation from a donor (Donor or Admin)
router.post(
  "/donation",
  authenticate,
  authorizeRoles("Donor", "Admin"),
  donorsController.postDonation
);

// Get donor impact summary (for logged-in donor)
router.get(
  "/impact",
  authenticate,
  authorizeRoles("Donor", "Admin"),
  donorsController.getImpact
);

module.exports = router;
