// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Firebase config (Realtime DB + Storage)
const { db, storage } = require("./src/config/firebase");

// Import routes
const authRoutes = require("./src/routes/auth");
const usersRoutes = require("./src/routes/users");
const farmersRoutes = require("./src/routes/farmers");
const buyersRoutes = require("./src/routes/buyers");
const donationsRoutes = require("./src/routes/donations");
const donorsRoutes = require("./src/routes/donors");
const deliveriesRoutes = require("./src/routes/deliveries");
const transactionsRoutes = require("./src/routes/transactions");
const cropHealthRoutes = require("./src/routes/cropHealth");
const impactRoutes = require("./src/routes/impact");
const listingsRoutes = require("./src/routes/listings");

const app = express();

// ---------------- MIDDLEWARES ----------------
app.use(cors());
app.use(express.json());

// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);       // Auth routes (register/login)
app.use("/api/users", usersRoutes);     // User management (Admin only)
app.use("/api/farmers", farmersRoutes);
app.use("/api/buyers", buyersRoutes);
app.use("/api/donations", donationsRoutes);
app.use("/api/donors", donorsRoutes);
app.use("/api/deliveries", deliveriesRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/cropHealth", cropHealthRoutes);
app.use("/api/impact", impactRoutes);
app.use("/api/listings", listingsRoutes);

// ---------------- TEST ROUTES ----------------
app.get("/", (req, res) => {
  res.send("Backend is working! Visit /api/impact/ping to test.");
});

app.get("/ping", (req, res) => {
  res.json({ status: "ok", message: "Server is alive" });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { db, storage };
