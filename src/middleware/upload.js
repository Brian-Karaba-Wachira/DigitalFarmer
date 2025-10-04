const multer = require("multer");

// Use memory storage for files (we'll upload to Firebase later)
const storage = multer.memoryStorage();

// Single file upload middleware
const uploadSingle = (fieldName) => multer({ storage }).single(fieldName);

// Multiple files upload middleware (optional)
const uploadMultiple = (fieldName, maxCount = 5) =>
  multer({ storage }).array(fieldName, maxCount);

module.exports = { uploadSingle, uploadMultiple };
