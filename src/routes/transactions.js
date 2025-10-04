const express = require("express");
const router = express.Router();
const transactionsController = require("..//controllers/transactionsController");

router.post("/", transactionsController.createTransaction);
router.get("/", transactionsController.getAllTransactions);
router.get("/:id", transactionsController.getTransactionById);

module.exports = router;
