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

const router = express.Router();

router.post("/", requireAuth, createKeys);
router.post("/verify", findKey);
router.get("/", requireAuth, getKeys);
router.get("/batch", requireAuth, getBatch);
router.get("/allbatches", requireAuth, getAllBatches);
router.get("/all", requireAuth, getAllKeys);
router.delete("/batch/:id", requireAuth, deleteBatch);
router.post("/delete-bulk", requireAuth, deleteBulkKeys);
router.delete("/:id", requireAuth, deleteKey);

module.exports = router;
