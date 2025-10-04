// src/routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ---------------- AUTH ROUTES ----------------

// Register a new user (anyone can register)
router.post("/register", authController.register);

// Login user
router.post("/login", authController.login);

// Note: /create-admin route removed for security

module.exports = router;
const usersController = require("../controllers/usersController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");