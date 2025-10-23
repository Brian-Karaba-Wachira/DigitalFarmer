const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// ---------------- AUTH ROUTES ----------------
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);

// Example of protected route (optional)
// router.get("/users", authenticate, authorizeRoles("admin"), usersController.getAllUsers);

module.exports = router;
