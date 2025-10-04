const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// Register a new user (Admin only)
router.post(
  "/register",
  authenticate,
  authorizeRoles("Admin"),
  usersController.registerUser
);

// Get all users (Admin only)
router.get(
  "/",
  authenticate,
  authorizeRoles("Admin"),
  usersController.getUsers
);

module.exports = router;
