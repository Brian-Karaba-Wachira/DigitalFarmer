const { db } = require("../config/firebase");

// Create a transaction
exports.createTransaction = async (req, res) => {
  try {
    const { email } = req.user; // authenticated user
    const newRef = db.ref("transactions").push();

    await newRef.set({ ...req.body, createdBy: email, createdAt: Date.now() });
    res.status(201).json({ message: "Transaction created", id: newRef.key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all transactions (authenticated)
exports.getAllTransactions = async (req, res) => {
  try {
    const snapshot = await db.ref("transactions").once("value");
    res.json(snapshot.val() || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get transaction by ID (authenticated)
exports.getTransactionById = async (req, res) => {
  try {
    const snapshot = await db.ref(`transactions/${req.params.id}`).once("value");
    res.json(snapshot.val() || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
