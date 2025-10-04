const { db, storage } = require("../config/firebase");  

// Upload crop image
exports.uploadCropImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const fileName = `cropHealth/${Date.now()}_${req.file.originalname}`;
    const file = storage.file(fileName);

    // Save the image to Firebase Storage
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype }
    });

    // Generate public image URL
    const imageUrl = `https://storage.googleapis.com/${storage.name}/${fileName}`;

    // Save metadata to Realtime DB
    const newRef = db.ref("crop_health").push();
    await newRef.set({
      farmerId: req.body.farmerId || null,
      notes: req.body.notes || "",
      imageUrl,
      createdAt: Date.now(),
    });

    res.status(201).json({ 
      message: "Crop health uploaded successfully", 
      id: newRef.key, 
      imageUrl 
    });
  } catch (err) {
    console.error("Error uploading crop health:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get a single crop health record by ID
exports.getCropHealth = async (req, res) => {
  try {
    const snapshot = await db.ref(`crop_health/${req.params.id}`).once("value");
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json({ id: req.params.id, ...snapshot.val() });
  } catch (err) {
    console.error("Error fetching crop health:", err);
    res.status(500).json({ error: err.message });
  }
};

// List ALL crop health records
exports.listCropHealth = async (req, res) => {
  try {
    const snapshot = await db.ref("crop_health").once("value");

    const records = [];
    snapshot.forEach(child => {
      records.push({
        id: child.key,
        ...child.val()
      });
    });

    res.json(records);
  } catch (err) {
    console.error("Error listing crop health:", err);
    res.status(500).json({ error: err.message });
  }
};
