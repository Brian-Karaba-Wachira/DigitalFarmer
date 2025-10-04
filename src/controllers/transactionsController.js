const { db } = require("../config/firebase");

exports.createTransaction = async (req, res) => {
  try {
    const newRef = db.ref("transactions").push();
    await newRef.set({ ...req.body, createdAt: Date.now() });
    res.status(201).json({ message: "Transaction created", id: newRef.key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const snapshot = await db.ref("transactions").once("value");
    res.json(snapshot.val() || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const snapshot = await db.ref(`transactions/${req.params.id}`).once("value");
    res.json(snapshot.val() || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
