const { db } = require("../config/firebase");
const { uploadFileToFirebase } = require("../utils/uploadFile"); // if you use it

// ------------------- Post surplus -------------------
const postSurplus = async (req, res) => {
  try {
    const { role, email } = req.user;
    if (role !== "farmer")
      return res.status(403).json({ error: "Only farmers can post surplus" });

    const { crop, quantity, price } = req.body;
    if (!crop || !quantity || !price)
      return res.status(400).json({ error: "All fields are required" });

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadFileToFirebase(req.file, "surplus");
    }

    const newRef = db.ref("surplus").push();
    await newRef.set({
      farmerId: email,
      crop,
      quantity,
      price,
      imageUrl,
      createdAt: Date.now(),
    });

    res.status(201).json({ message: "Surplus posted", id: newRef.key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------- Donate produce -------------------
const donateProduce = async (req, res) => {
  try {
    const { role, email } = req.user;
    if (role !== "farmer")
      return res.status(403).json({ error: "Only farmers can donate produce" });

    const { crop, quantity } = req.body;
    if (!crop || !quantity)
      return res.status(400).json({ error: "All fields are required" });

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadFileToFirebase(req.file, "donations");
    }

    const newRef = db.ref("donations").push();
    await newRef.set({
      farmerId: email,
      crop,
      quantity,
      imageUrl,
      createdAt: Date.now(),
    });

    res.status(201).json({ message: "Donation posted", id: newRef.key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------- Get reputation -------------------
const getReputation = async (req, res) => {
  try {
    const { farmerId } = req.params;
    if (!farmerId) return res.status(400).json({ error: "Farmer ID required" });

    const snapshot = await db.ref("ratings").orderByChild("farmerId").equalTo(farmerId).once("value");
    if (!snapshot.exists()) return res.json({ farmerId, reputationScore: 0 });

    let total = 0, count = 0;
    snapshot.forEach(doc => {
      total += doc.val().score || 0;
      count++;
    });

    res.json({ farmerId, reputationScore: (total / count).toFixed(2), totalRatings: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------- Dashboard -------------------
const getDashboard = async (req, res) => {
  try {
    const { email, role } = req.user;
    if (role !== "farmer")
      return res.status(403).json({ error: "Access denied: Farmers only" });

    const surplusSnap = await db.ref("surplus").orderByChild("farmerId").equalTo(email).once("value");
    const donationsSnap = await db.ref("donations").orderByChild("farmerId").equalTo(email).once("value");

    const surplusList = [];
    const donationList = [];

    surplusSnap.forEach(item => surplusList.push({ id: item.key, ...item.val() }));
    donationsSnap.forEach(item => donationList.push({ id: item.key, ...item.val() }));

    res.json({
      message: "Farmer dashboard loaded",
      farmer: email,
      surplus: surplusList,
      donations: donationList,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Export them properly
module.exports = {
  postSurplus,
  donateProduce,
  getReputation,
  getDashboard,
};
