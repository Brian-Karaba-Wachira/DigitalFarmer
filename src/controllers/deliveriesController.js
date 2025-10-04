const { db } = require("../config/firebase");

// Allowed delivery statuses
const VALID_STATUSES = ["pending", "in-transit", "completed", "cancelled"];

// Create delivery (Delivery agents or Admin)
exports.createDelivery = async (req, res) => {
  try {
    const { role, email } = req.user;
    if (!["Delivery", "Admin"].includes(role)) {
      return res.status(403).json({ error: "Only delivery agents or admin can create deliveries" });
    }

    const newRef = db.ref("deliveries").push();
    await newRef.set({
      ...req.body,
      assignedTo: role === "Delivery" ? email : req.body.assignedTo || null,
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

// Get all deliveries (Admin sees all, Delivery sees assigned only)
exports.getAllDeliveries = async (req, res) => {
  try {
    const { role, email } = req.user;
    const snapshot = await db.ref("deliveries").once("value");
    const deliveries = [];

    snapshot.forEach(child => {
      const data = { id: child.key, ...child.val() };
      if (role === "Admin" || data.assignedTo === email) {
        deliveries.push(data);
      }
    });

    res.json(deliveries);
  } catch (err) {
    console.error("Error fetching deliveries:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get delivery by ID
exports.getDeliveryById = async (req, res) => {
  try {
    const { role, email } = req.user;
    const snapshot = await db.ref(`deliveries/${req.params.id}`).once("value");

    if (!snapshot.exists()) return res.status(404).json({ error: "Delivery not found" });

    const delivery = snapshot.val();
    if (role !== "Admin" && delivery.assignedTo !== email) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ id: req.params.id, ...delivery });
  } catch (err) {
    console.error("Error fetching delivery:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update delivery (general fields)
exports.updateDelivery = async (req, res) => {
  try {
    const { role, email } = req.user;
    const deliveryRef = db.ref(`deliveries/${req.params.id}`);
    const snapshot = await deliveryRef.once("value");

    if (!snapshot.exists()) return res.status(404).json({ error: "Delivery not found" });

    const delivery = snapshot.val();
    if (role !== "Admin" && delivery.assignedTo !== email) {
      return res.status(403).json({ error: "Access denied" });
    }

    await deliveryRef.update({ ...req.body, updatedAt: Date.now() });
    res.json({ message: "Delivery updated" });
  } catch (err) {
    console.error("Error updating delivery:", err);
    res.status(500).json({ error: err.message });
  }
};

// Change delivery status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { role, email } = req.user;

    if (!VALID_STATUSES.includes(status)) return res.status(400).json({ error: "Invalid status value" });

    const deliveryRef = db.ref(`deliveries/${req.params.id}`);
    const snapshot = await deliveryRef.once("value");
    if (!snapshot.exists()) return res.status(404).json({ error: "Delivery not found" });

    const delivery = snapshot.val();
    if (role !== "Admin" && delivery.assignedTo !== email) {
      return res.status(403).json({ error: "Access denied" });
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
    const { role, email } = req.user;
    const deliveryRef = db.ref(`deliveries/${req.params.id}`);
    const snapshot = await deliveryRef.once("value");

    if (!snapshot.exists()) return res.status(404).json({ error: "Delivery not found" });

    const delivery = snapshot.val();
    if (role !== "Admin" && delivery.assignedTo !== email) {
      return res.status(403).json({ error: "Access denied" });
    }

    await deliveryRef.remove();
    res.json({ message: "Delivery deleted" });
  } catch (err) {
    console.error("Error deleting delivery:", err);
    res.status(500).json({ error: err.message });
  }
};
