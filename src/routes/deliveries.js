const express = require("express");
const router = express.Router();
const deliveriesController = require("../controllers/deliveriesController");

router.post("/", deliveriesController.createDelivery);
router.get("/", deliveriesController.getAllDeliveries);
router.get("/:id", deliveriesController.getDeliveryById);
router.put("/:id", deliveriesController.updateDelivery);
router.patch("/:id/status", deliveriesController.updateDeliveryStatus); //  NEW route
router.delete("/:id", deliveriesController.deleteDelivery);

module.exports = router;

