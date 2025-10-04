const { db } = require("../config/firebase");

// Allowed statuses
const VALID_STATUSES = ["available", "claimed", "delivered", "expired"];

// Register donation (with donorId, item, unit, location)
exports.registerDonation = async (req, res) => {
  try {
    const { donorId, item, quantity, unit, location } = req.body;

    if (!donorId || !item || !quantity || !unit) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newDonationRef = db.ref("donations").push();
    await newDonationRef.set({
      donorId,
      item,
      quantity,
      unit,
      location: location || "",
      status: "pending", // could be pending, delivered, allocated
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    res.status(201).json({
      message: "Donation registered successfully",
      donationId: newDonationRef.key,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create donation (simpler version with foodType, quantity)
exports.createDonation = async (req, res) => {
  try {
    const { donorId, foodType, quantity } = req.body;

    if (!donorId || !foodType || !quantity) {
      return res.status(400).json({ error: "donorId, foodType, and quantity are required" });
    }

    const newRef = db.ref("donations").push();
    const donationData = {
      donorId,
      foodType,
      quantity,
      status: "available", // default
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await newRef.set(donationData);

    res.status(201).json({ message: "Donation created", id: newRef.key, ...donationData });
  } catch (err) {
    console.error("Error creating donation:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all donations
exports.getAllDonations = async (req, res) => {
  try {
    const snapshot = await db.ref("donations").once("value");
    const donations = [];
    snapshot.forEach(child => {
      donations.push({ id: child.key, ...child.val() });
    });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get donation by ID
exports.getDonationById = async (req, res) => {
  try {
    const snapshot = await db.ref(`donations/${req.params.id}`).once("value");
    if (!snapshot.exists()) return res.status(404).json({ error: "Donation not found" });
    res.json({ id: req.params.id, ...snapshot.val() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update donation (general fields)
exports.updateDonation = async (req, res) => {
  try {
    const donationRef = db.ref(`donations/${req.params.id}`);
    const snapshot = await donationRef.once("value");

    if (!snapshot.exists()) return res.status(404).json({ error: "Donation not found" });

    await donationRef.update({ ...req.body, updatedAt: Date.now() });
    res.json({ message: "Donation updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Update donation status only
exports.updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const donationRef = db.ref(`donations/${req.params.id}`);
    const snapshot = await donationRef.once("value");

    if (!snapshot.exists()) return res.status(404).json({ error: "Donation not found" });

    await donationRef.update({ status, updatedAt: Date.now() });
    res.json({ message: `Donation status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Delete donation
exports.deleteDonation = async (req, res) => {
  try {
    const donationRef = db.ref(`donations/${req.params.id}`);
    const snapshot = await donationRef.once("value");

    if (!snapshot.exists()) return res.status(404).json({ error: "Donation not found" });

    await donationRef.remove();
    res.json({ message: "Donation deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
