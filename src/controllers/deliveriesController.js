const { db } = require("../config/firebase");

// Allowed delivery statuses
const VALID_STATUSES = ["pending", "in-transit", "completed", "cancelled"];

//  Create delivery (always starts as pending)
exports.createDelivery = async (req, res) => {
  try {
    const newRef = db.ref("deliveries").push();
    await newRef.set({
      ...req.body,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    res.status(201).json({ message: "Delivery created", id: newRef.key });
  } catch (err) {
    console.error("Error creating delivery:", err);
    res.status(500).json({ error: err.message });
  }
};

//  Get all deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const snapshot = await db.ref("deliveries").once("value");

    const deliveries = [];
    snapshot.forEach(child => {
      deliveries.push({ id: child.key, ...child.val() });
    });

    res.json(deliveries);
  } catch (err) {
    console.error("Error fetching deliveries:", err);
    res.status(500).json({ error: err.message });
  }
};

//  Get delivery by ID
exports.getDeliveryById = async (req, res) => {
  try {
    const snapshot = await db.ref(`deliveries/${req.params.id}`).once("value");
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Delivery not found" });
    }
    res.json({ id: req.params.id, ...snapshot.val() });
  } catch (err) {
    console.error("Error fetching delivery:", err);
    res.status(500).json({ error: err.message });
  }
};

//  Update delivery (general fields, not status)
exports.updateDelivery = async (req, res) => {
  try {
    const deliveryRef = db.ref(`deliveries/${req.params.id}`);
    const snapshot = await deliveryRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    await deliveryRef.update({ ...req.body, updatedAt: Date.now() });
    res.json({ message: "Delivery updated" });
  } catch (err) {
    console.error("Error updating delivery:", err);
    res.status(500).json({ error: err.message });
  }
};

//  Change delivery status (only valid values)
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const deliveryRef = db.ref(`deliveries/${req.params.id}`);
    const snapshot = await deliveryRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    await deliveryRef.update({ status, updatedAt: Date.now() });
    res.json({ message: `Delivery status updated to ${status}` });
  } catch (err) {
    console.error("Error updating delivery status:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete delivery
exports.deleteDelivery = async (req, res) => {
  try {
    const deliveryRef = db.ref(`deliveries/${req.params.id}`);
    const snapshot = await deliveryRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    await deliveryRef.remove();
    res.json({ message: "Delivery deleted" });
  } catch (err) {
    console.error("Error deleting delivery:", err);
    res.status(500).json({ error: err.message });
  }
};
