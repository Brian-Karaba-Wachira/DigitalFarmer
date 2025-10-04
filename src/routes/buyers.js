const express = require("express");
const router = express.Router();
const buyersController = require("../controllers/buyersController");

router.get("/food", buyersController.getAvailableFood);
router.post("/claim", buyersController.claimDonation);

module.exports = router;
