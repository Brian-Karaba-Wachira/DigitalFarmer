const express = require("express");
const router = express.Router();
const buyersController = require("../controllers/buyersController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// Public route: anyone can view available food
router.get("/food", buyersController.getAvailableFood);

// Only authenticated Buyers or NGOs can claim donations
router.post(
  "/claim",
  authenticate,
  authorizeRoles("Buyer", "NGO"),
  buyersController.claimDonation
);

module.exports = router;
