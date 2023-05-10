const express = require("express");

const {
  loginUser,
  getUser,
} = require("../controllers/authController");
const requireAuth = require("../middlewares/requireAuth");
const validateRequiredFields = require("../middlewares/validateFields");


const router = express.Router();
router.post("/login", validateRequiredFields([ 'email', 'password']),loginUser);
router.get("/user-info", requireAuth, getUser);
module.exports = router;
