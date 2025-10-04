const express = require("express");
const router = express.Router();
const donorsController = require("../controllers/donorsController");

// Post a donation from a donor
router.post("/donation", donorsController.postDonation);

// Get donor impact summary
router.get("/:donorId/impact", donorsController.getImpact);

module.exports = router;

