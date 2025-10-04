const express = require("express");
const router = express.Router();
const deliveriesController = require("../controllers/deliveriesController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// Create a new delivery (Delivery agents or Admin)
router.post(
  "/",
  authenticate,
  authorizeRoles("Delivery", "Admin"),
  deliveriesController.createDelivery
);

// Get all deliveries (Admin sees all, Delivery sees their own)
router.get(
  "/",
  authenticate,
  authorizeRoles("Delivery", "Admin"),
  deliveriesController.getAllDeliveries
);

// Get delivery by ID
router.get(
  "/:id",
  authenticate,
  authorizeRoles("Delivery", "Admin"),
  deliveriesController.getDeliveryById
);

// Update delivery general fields
router.put(
  "/:id",
  authenticate,
  authorizeRoles("Delivery", "Admin"),
  deliveriesController.updateDelivery
);

// Update delivery status
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("Delivery", "Admin"),
  deliveriesController.updateDeliveryStatus
);

// Delete delivery
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("Delivery", "Admin"),
  deliveriesController.deleteDelivery
);

module.exports = router;
