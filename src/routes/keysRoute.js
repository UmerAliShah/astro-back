const express = require("express");

const {
  createKeys,
  findKey,
  deleteKey,
  getKeys,
} = require("../controllers/keysController");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.post("/", requireAuth, createKeys);
router.post("/verify", findKey);
router.get("/", getKeys);
router.delete("/:id", deleteKey);

module.exports = router;
