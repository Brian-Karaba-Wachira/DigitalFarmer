const express = require("express");
const router = express.Router();
const impactController = require("../controllers/impactController");

// Get overall impact stats
router.get("/", impactController.getImpactStats);

// Get impact of a specific donor
router.get("/:donorId", impactController.getDonorImpact);

// Health check route
router.get("/ping", (req, res) => {
  res.json({ msg: "Impact API is alive" });
});

module.exports = router;
