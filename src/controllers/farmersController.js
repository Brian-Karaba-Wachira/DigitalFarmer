const { db } = require("../config/firebase");

// Post surplus for sale
exports.postSurplus = async (req, res) => {
  try {
    const { farmerId, crop, quantity, price } = req.body;

    if (!farmerId || !crop || !quantity || !price) {
      return res.status(400).json({ error: "All fields (farmerId, crop, quantity, price) are required" });
    }

    const newRef = db.ref("surplus").push();
    await newRef.set({
      farmerId,
      crop,
      quantity,
      price,
      type: "sale",
      createdAt: Date.now(),
    });

    res.status(201).json({
      message: "Surplus posted successfully",
      id: newRef.key,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Donate produce
exports.donateProduce = async (req, res) => {
  try {
    const { farmerId, crop, quantity } = req.body;

    if (!farmerId || !crop || !quantity) {
      return res.status(400).json({ error: "All fields (farmerId, crop, quantity) are required" });
    }

    const newRef = db.ref("donations").push();
    await newRef.set({
      farmerId,
      crop,
      quantity,
      urgent: true,
      createdAt: Date.now(),
    });

    res.status(201).json({
      message: "Donation posted successfully",
      id: newRef.key,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get farmer reputation score
exports.getReputation = async (req, res) => {
  try {
    const { farmerId } = req.params;

    if (!farmerId) {
      return res.status(400).json({ error: "Farmer ID is required" });
    }

    const snapshot = await db
      .ref("ratings")
      .orderByChild("farmerId")
      .equalTo(farmerId)
      .once("value");

    if (!snapshot.exists()) {
      return res.json({ farmerId, reputationScore: 0 });
    }

    let total = 0, count = 0;
    snapshot.forEach((doc) => {
      total += doc.val().score || 0;
      count++;
    });

    res.json({
      farmerId,
      reputationScore: (total / count).toFixed(2), 
      totalRatings: count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
