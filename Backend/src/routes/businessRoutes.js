const express = require("express");
const router = express.Router();
const {
  createProfile,
  getProfile,
} = require("../controllers/businessController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

router.post("/profile", protect, allowRoles("business"), createProfile);
router.get("/profile", protect, allowRoles("business"), getProfile);

module.exports = router;
