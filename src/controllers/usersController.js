const { db } = require("../config/firebase");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) return res.status(400).json({ error: "All fields required" });

    const newUserRef = db.ref("users").push();
    await newUserRef.set({
      name,
      email,
      role,
      createdAt: Date.now(),
    });

    res.status(201).json({ message: "User registered", id: newUserRef.key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const snapshot = await db.ref("users").once("value");
    res.json(snapshot.val() || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
