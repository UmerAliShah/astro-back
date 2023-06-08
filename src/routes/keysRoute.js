const express = require("express");

const {
  createKeys,
  findKey,
  deleteKey,
  getKeys,
  getBatch,
  deleteBatch,
  getAllKeys,
  deleteBulkKeys,
  getAllBatches,
} = require("../controllers/keysController");
const requireAuth = require("../middlewares/requireAuth");
// const upload = require("../middlewares/uploadMulter");

const router = express.Router();

const multer = require("multer");
const path = require("path");
// Configure multer storage and file naming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination folder to save the uploaded files
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    console.log("file---------", file);
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

// Create multer upload middleware with the configured storage
const upload = multer({ storage });

// Export the configured upload middleware
module.exports = upload;

router.post("/", requireAuth, upload.single("file"), createKeys);
router.post("/verify", findKey);
router.get("/", requireAuth, getKeys);
router.get("/batch", requireAuth, getBatch);
router.get("/allbatches", requireAuth, getAllBatches);
router.get("/all", requireAuth, getAllKeys);
router.delete("/batch/:id", requireAuth, deleteBatch);
router.post("/delete-bulk", requireAuth, deleteBulkKeys);
router.delete("/:id", requireAuth, deleteKey);

module.exports = router;
