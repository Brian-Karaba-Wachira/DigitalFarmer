// src/config/firebase.js
const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

const serviceAccount = require(path.resolve(__dirname, "../../serviceAccountKey.json"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = admin.database();
const storage = admin.storage().bucket();

module.exports = { admin, db, storage };

