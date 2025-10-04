const { db } = require("../config/firebase");

// Create new listing
const createListing = async (req, res) => {
  try {
    const { role, email } = req.user;
    if (!["Farmer", "Donor", "Admin"].includes(role)) {
      return res.status(403).json({ error: "Only farmers, donors, or admin can create listings" });
    }

    const newListingRef = db.ref("listings").push();
    await newListingRef.set({
      ...req.body,
      creator: email,
      status: "available",
      createdAt: Date.now()
    });

    res.status(201).json({ id: newListingRef.key, message: "Listing created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all listings (public)
const getListings = async (req, res) => {
  try {
    const snapshot = await db.ref("listings").once("value");
    res.json(snapshot.val() || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Claim a listing
const claimListing = async (req, res) => {
  try {
    const { role, email } = req.user;
    if (!["Buyer", "NGO", "Admin"].includes(role)) {
      return res.status(403).json({ error: "Only buyers, NGOs, or admin can claim listings" });
    }

    const { id } = req.params;
    await db.ref(`listings/${id}`).update({ status: "claimed", claimedBy: email });
    res.json({ message: "Listing claimed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createListing, getListings, claimListing };
