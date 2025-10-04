const express = require("express");
const multer = require("multer");
const router = express.Router();
const cropHealthController = require("../controllers/cropHealthController");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("image"), cropHealthController.uploadCropImage);
router.get("/:id", cropHealthController.getCropHealth);

module.exports = router;

