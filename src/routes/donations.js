const express = require("express");
const router = express.Router();
const donationsController = require("../controllers/donationsController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// ---------------- PUBLIC ROUTES ----------------
router.get("/", donationsController.getAllDonations);
router.get("/:id", donationsController.getDonationById);

// ---------------- AUTHENTICATED ROUTES ----------------
// Register a donation (Donor or Admin)
router.post(
  "/register",
  authenticate,
  authorizeRoles("Donor", "Admin"),
  donationsController.registerDonation
);

// Create a donation (Donor or Admin)
router.post(
  "/create",
  authenticate,
  authorizeRoles("Donor", "Admin"),
  donationsController.createDonation
);

// Update donation
router.put(
  "/:id",
  authenticate,
  authorizeRoles("Donor", "Admin"),
  donationsController.updateDonation
);

// Update donation status
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("Donor", "Admin"),
  donationsController.updateDonationStatus
);

// Delete donation
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("Donor", "Admin"),
  donationsController.deleteDonation
);

module.exports = router;
