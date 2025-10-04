const { db } = require("../config/firebase");

// Create new listing
const createListing = async (req, res) => {
  try {
    const newListingRef = db.ref("listings").push();
    await newListingRef.set({
      ...req.body,
      status: "available",
      createdAt: Date.now()
    });
    res.status(201).json({ id: newListingRef.key, message: "Listing created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all listings
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
    const { id } = req.params;
    await db.ref(`listings/${id}`).update({ status: "claimed" });
    res.json({ message: "Listing claimed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createListing, getListings, claimListing };
