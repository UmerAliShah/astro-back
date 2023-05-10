const express = require("express");

const {
  getProduct,
  addProduct,
  putProduct,
} = require("../controllers/ProductController");
const upload = require("../middlewares/uploadMulter");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();
router.post("/", requireAuth, upload.single("image"), addProduct);
router.put("/:id", requireAuth, upload.single("image"), putProduct);
router.get("/", requireAuth, getProduct);
module.exports = router;
