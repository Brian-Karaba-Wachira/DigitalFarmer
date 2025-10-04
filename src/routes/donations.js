const express = require("express");
const router = express.Router();
const donationsController = require("../controllers/donationsController");
const { registerDonation } = require("../controllers/donationsController");

router.post("/", registerDonation);

router.post("/", donationsController.createDonation);
router.get("/", donationsController.getAllDonations);
router.get("/:id", donationsController.getDonationById);
router.put("/:id", donationsController.updateDonation);
router.patch("/:id/status", donationsController.updateDonationStatus); // 👈 new
router.delete("/:id", donationsController.deleteDonation);

module.exports = router;
