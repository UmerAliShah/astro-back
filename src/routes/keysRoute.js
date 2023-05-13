const express = require("express");

const { createKeys, findKey } = require("../controllers/keysController");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.post("/", requireAuth, createKeys);
router.post("/verify", findKey);

module.exports = router;
