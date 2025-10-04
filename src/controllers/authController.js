const jwt = require("jsonwebtoken");
const { db } = require("../config/firebase");

// Register user (public)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields required" });
    }

    // Save user in Firebase
    const newUserRef = db.ref("users").push();
    await newUserRef.set({
      name,
      email,
      password, // TODO: hash passwords in production
      role,
      createdAt: Date.now(),
    });

    res.status(201).json({ message: "User registered", id: newUserRef.key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login user (public)
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

    if (user.password !== password) return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
