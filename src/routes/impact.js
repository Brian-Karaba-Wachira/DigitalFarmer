const express = require("express");
const router = express.Router();
const impactController = require("../controllers/impactController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// Public routes
router.get("/", impactController.getImpactStats);

// Health check route
router.get("/ping", (req, res) => {
  res.json({ msg: "Impact API is alive" });
});

// Authenticated route: donor-specific impact
router.get(
  "/donor",
  authenticate,
  authorizeRoles("Donor", "Admin"),
  impactController.getDonorImpact
);

module.exports = router;
