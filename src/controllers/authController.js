const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // For hashing passwords
const { db } = require("../config/firebase");

// ---------------- REGISTER USER ----------------
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, location, vehicleType } = req.body;
    if (!name || !email || !password || !role || !phone || !location) {
      return res.status(400).json({ error: "All fields required" });
    }

    // Check if user already exists
    const snapshot = await db.ref("users").orderByChild("email").equalTo(email).once("value");
    if (snapshot.exists()) return res.status(400).json({ error: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in Firebase
    const newUserRef = db.ref("users").push();
    await newUserRef.set({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      location,
      vehicleType: vehicleType || null,
      createdAt: Date.now(),
    });

    // Generate JWT
    const userId = newUserRef.key;
const token = jwt.sign({ id: userId, role: user.role.toLowerCase() }, process.env.JWT_SECRET, { expiresIn: "1d" });


    // Respond with token + user object
    res.status(201).json({
      token,
      user: {
        id: newUserRef.key,
        name,
        email,
        role,
        phone,
        location,
        vehicleType: vehicleType || null
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- LOGIN USER ----------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "All fields required" });

    // Find user by email
    const snapshot = await db.ref("users").orderByChild("email").equalTo(email).once("value");
    const userObj = snapshot.val();
    if (!userObj) return res.status(401).json({ error: "Invalid credentials" });

    const userId = Object.keys(userObj)[0];
    const user = userObj[userId];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        vehicleType: user.vehicleType || null
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- FORGOT PASSWORD ----------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ error: "Email and new password required" });

    const snapshot = await db.ref("users").orderByChild("email").equalTo(email).once("value");
    const userObj = snapshot.val();
    if (!userObj) return res.status(404).json({ error: "User not found" });

    const userId = Object.keys(userObj)[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.ref(`users/${userId}`).update({ password: hashedPassword });

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
