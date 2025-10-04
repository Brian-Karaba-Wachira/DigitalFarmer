const express = require("express");
const router = express.Router();
const farmersController = require("../controllers/farmersController");

router.post("/surplus", farmersController.postSurplus);
router.post("/donate", farmersController.donateProduce);
router.get("/:farmerId/reputation", farmersController.getReputation);

module.exports = router;

