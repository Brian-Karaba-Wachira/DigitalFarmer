const express = require("express");
const router = express.Router();
const { createListing, getListings, claimListing } = require("../controllers/listingsController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// Public route: get all listings
router.get("/", getListings);

// Authenticated route: create listing (Farmer, Donor, Admin)
router.post(
  "/",
  authenticate,
  authorizeRoles("Farmer", "Donor", "Admin"),
  createListing
);

// Authenticated route: claim listing (Buyer, NGO, Admin)
router.patch(
  "/:id/claim",
  authenticate,
  authorizeRoles("Buyer", "NGO", "Admin"),
  claimListing
);

module.exports = router;
