const { db } = require("../config/firebase");

// Post a donation (specific from a donor)
exports.postDonation = async (req, res) => {
  try {
    const { role, email } = req.user;
    if (!["Donor", "Admin"].includes(role)) {
      return res.status(403).json({ error: "Only donors or admin can post donations" });
    }

    const { food, quantity, expiryDate } = req.body;
    if (!food || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newRef = db.ref("donations").push();
    await newRef.set({
      donorId: email, // use authenticated donor
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
    const { role, email } = req.user;
    if (!["Donor", "Admin"].includes(role)) {
      return res.status(403).json({ error: "Only donors or admin can view impact" });
    }

    const donorId = email;
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
