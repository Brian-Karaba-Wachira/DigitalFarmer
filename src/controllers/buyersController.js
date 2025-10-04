const { db } = require("../config/firebase");

// Get available food
exports.getAvailableFood = async (req, res) => {
  try {
    const snapshot = await db.ref("surplus").once("value");

    // Convert snapshot to array with IDs for frontend clarity
    const surplusData = [];
    snapshot.forEach(child => {
      surplusData.push({
        id: child.key,
        ...child.val()
      });
    });

    res.json(surplusData);
  } catch (err) {
    console.error("Error fetching surplus:", err);
    res.status(500).json({ error: err.message });
  }
};

// Claim a donation
exports.claimDonation = async (req, res) => {
  try {
    const { buyerId, donationId } = req.body;

    if (!buyerId || !donationId) {
      return res.status(400).json({ error: "buyerId and donationId are required" });
    }

    // Create new claim record
    const newRef = db.ref("claims").push();
    await newRef.set({
      buyerId,
      donationId,
      claimedAt: Date.now()
    });

    res.status(201).json({ 
      message: "Donation claimed successfully", 
      id: newRef.key 
    });
  } catch (err) {
    console.error("Error claiming donation:", err);
    res.status(500).json({ error: err.message });
  }
};
