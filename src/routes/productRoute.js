const express = require("express");

const {
  getProduct,
  addProduct,
  putProduct,
  deleteProduct,
  getVerifiedProduct,
} = require("../controllers/productController");
const upload = require("../middlewares/uploadMulter");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();
router.post("/", requireAuth, upload.single("image"), addProduct);
router.put("/:id", requireAuth, upload.single("image"), putProduct);
router.delete("/:id", requireAuth, deleteProduct);
router.get("/", getProduct);
router.get("/getVerifiedProduct/:pc", getVerifiedProduct);
module.exports = router;
