const admin = require("firebase-admin");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// This helper uploads a file buffer to Firebase Storage
const uploadFileToFirebase = async (file, folderName) => {
  if (!file) throw new Error("No file provided");

  const bucket = admin.storage().bucket();
  const fileName = `${folderName}/${uuidv4()}_${path.basename(file.originalname)}`;
  const fileUpload = bucket.file(fileName);

  const options = {
    metadata: {
      contentType: file.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
      },
    },
  };

  await fileUpload.save(file.buffer, options);
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    fileName
  )}?alt=media&token=${options.metadata.metadata.firebaseStorageDownloadTokens}`;

  return url;
};

module.exports = { uploadFileToFirebase };
