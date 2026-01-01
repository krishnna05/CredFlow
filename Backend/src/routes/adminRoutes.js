const express = require("express");
const router = express.Router();
const { getPortfolio } = require("../controllers/adminController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.get(
  "/portfolio",
  protect,
  allowRoles("admin"),
  getPortfolio
);

module.exports = router;
