const { db } = require("../config/firebase");

// Get overall impact stats (public)
exports.getImpactStats = async (req, res) => {
  try {
    const donationsSnap = await db.ref("donations").once("value");
    const transactionsSnap = await db.ref("transactions").once("value");

    let totalFoodSaved = 0;
    const donorsSet = new Set();

    donationsSnap.forEach((d) => {
      const val = d.val();
      totalFoodSaved += val.quantity || 0;
      if (val.donorId) donorsSet.add(val.donorId);
    });

    const peopleFed = transactionsSnap.numChildren();

    res.json({
      foodSaved: totalFoodSaved,
      peopleFed,
      donorsCount: donorsSet.size,
    });
  } catch (err) {
    console.error("Error fetching impact stats:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get donor impact for authenticated user
exports.getDonorImpact = async (req, res) => {
  try {
    const { role, email } = req.user;
    if (!["Donor", "Admin"].includes(role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const donorId = email;
    const snapshot = await db
      .ref("donations")
      .orderByChild("donorId")
      .equalTo(donorId)
      .once("value");

    if (!snapshot.exists()) {
      return res.json({ donorId, totalQuantityDonated: 0 });
    }

    let totalQuantity = 0;
    snapshot.forEach((doc) => {
      totalQuantity += doc.val().quantity || 0;
    });

    res.json({ donorId, totalQuantityDonated: totalQuantity });
  } catch (err) {
    console.error("Error fetching donor impact:", err);
    res.status(500).json({ error: err.message });
  }
};
