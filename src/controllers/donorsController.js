const { db } = require("../config/firebase");

// Post a donation (specific from a donor)
exports.postDonation = async (req, res) => {
  try {
    const { donorId, food, quantity, expiryDate } = req.body;

    if (!donorId || !food || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newRef = db.ref("donations").push();
    await newRef.set({
      donorId,
      food,
      quantity,
      expiryDate: expiryDate || null,
      urgent: true,
      createdAt: Date.now(),
    });

    res.status(201).json({
      message: "Donation added successfully",
      id: newRef.key,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get donor's total impact
exports.getImpact = async (req, res) => {
  try {
    const { donorId } = req.params;

    if (!donorId) {
      return res.status(400).json({ error: "Donor ID is required" });
    }

    const snapshot = await db
      .ref("donations")
      .orderByChild("donorId")
      .equalTo(donorId)
      .once("value");

    let totalQuantity = 0;
    snapshot.forEach((doc) => {
      totalQuantity += doc.val().quantity || 0;
    });

    res.json({
      donorId,
      totalQuantityDonated: totalQuantity,
      donations: snapshot.val() || {},
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
