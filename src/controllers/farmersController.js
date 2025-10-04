const { db, storage } = require("../config/firebase");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // store file in memory

// Helper function to upload file to Firebase Storage
const uploadFileToFirebase = async (file, folder = "uploads") => {
  if (!file) return null;

  const fileName = `${folder}/${Date.now()}_${file.originalname}`;
  const fileRef = storage.bucket().file(fileName);

  await fileRef.save(file.buffer, {
    contentType: file.mimetype,
  });

  // Make file public and return URL
  await fileRef.makePublic();
  return fileRef.publicUrl();
};

// Post surplus for sale (with optional image)
exports.postSurplus = async (req, res) => {
  try {
    const { role, email } = req.user;
    if (role !== "Farmer") return res.status(403).json({ error: "Only farmers can post surplus" });

    const { crop, quantity, price } = req.body;
    if (!crop || !quantity || !price)
      return res.status(400).json({ error: "All fields (crop, quantity, price) are required" });

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
      type: "sale",
      imageUrl,
      createdAt: Date.now(),
    });

    res.status(201).json({ message: "Surplus posted successfully", id: newRef.key, imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Donate produce (with optional image)
exports.donateProduce = async (req, res) => {
  try {
    const { role, email } = req.user;
    if (role !== "Farmer") return res.status(403).json({ error: "Only farmers can donate produce" });

    const { crop, quantity } = req.body;
    if (!crop || !quantity)
      return res.status(400).json({ error: "All fields (crop, quantity) are required" });

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadFileToFirebase(req.file, "donations");
    }

    const newRef = db.ref("donations").push();
    await newRef.set({
      farmerId: email,
      crop,
      quantity,
      urgent: true,
      imageUrl,
      createdAt: Date.now(),
    });

    res.status(201).json({ message: "Donation posted successfully", id: newRef.key, imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get farmer reputation
exports.getReputation = async (req, res) => {
  try {
    const { farmerId } = req.params;
    if (!farmerId) return res.status(400).json({ error: "Farmer ID is required" });

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
// Middleware to handle file uploads for surplus and donations