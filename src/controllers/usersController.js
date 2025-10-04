const { db } = require("../config/firebase");

// Register a new user (Admin only)
exports.registerUser = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "Admin") {
      return res.status(403).json({ error: "Only admins can register users" });
    }

    const { name, email, role: userRole } = req.body;
    if (!name || !email || !userRole) {
      return res.status(400).json({ error: "All fields required" });
    }

    const newUserRef = db.ref("users").push();
    await newUserRef.set({
      name,
      email,
      role: userRole,
      createdAt: Date.now(),
    });

    res.status(201).json({ message: "User registered", id: newUserRef.key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "Admin") {
      return res.status(403).json({ error: "Only admins can view users" });
    }

    const snapshot = await db.ref("users").once("value");
    res.json(snapshot.val() || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
