const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactionsController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// Authenticated route: create transaction (Buyer, NGO, Admin)
router.post(
  "/",
  authenticate,
  authorizeRoles("Buyer", "NGO", "Admin"),
  transactionsController.createTransaction
);

// Authenticated routes: get all transactions or by ID
router.get("/", authenticate, transactionsController.getAllTransactions);
router.get("/:id", authenticate, transactionsController.getTransactionById);

module.exports = router;
